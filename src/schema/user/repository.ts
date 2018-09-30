import * as bcrypt from 'bcryptjs';
import { validate } from 'class-validator';
import * as crypto from 'crypto';
import values from 'lodash/values';

import * as moment from 'moment';
import 'moment-timezone';
import { from, Observable, Observer, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EntityManager, EntityRepository } from 'typeorm';

import { User } from './entity';

/**
 * @desc this class will hold functions for user repository.
 * examples include: []
 * @author Pablo Carrera pcarrerae@carreraestrada.com
 * @required User Entity Repository.
 */
@EntityRepository()
class UserRepository {

  private saltRounds = 10;

  constructor (private manager: EntityManager) { }

  /**
   * @desc Observable function for find user by ID.
   * @param id: string - the id of the user.
   * @return User - success or failure
   */

  public findById (id: string): Observable<User> {
    return from(this.manager.findOne(User, {id}));
  }

  /**
   * @desc Observable function for find user by ID or email.
   * @param id: string - the id or email of the user.
   * @return User - success or failure
   */

  public findByIdOrEmail (id: string): Observable<User> {
    return from(new Promise(async (resolve, reject) => {
      try {
        const user = await this.manager.findOne(User, {id}) || await this.manager.findOne(User, { email: id });
        resolve(user);
      } catch (error) {
        reject(error);
      }
    }));
  }

  /**
   * @desc Observable function for find user by email.
   * @param id: string - the email of the user.
   * @return User - success or failure
   */

  public findByEmail (email: string): Observable<User> {
    return from(this.manager.findOne(User, { email }));
  }

  /**
   * @desc Observable function for find user by username or email.
   * @param uoe: string - the username or email of the user.
   * @return User - success or failure
   */

  public findByUsernameOrEmail (uoe: string): Observable<User> {
    return from(new Promise(async (resolve, reject) => {
      try {
        const user = await this.manager.findOne(User, { username: uoe }) || await this.manager.findOne(User, { email: uoe });
        resolve(user);
      } catch (error) {
        reject(error);
      }
    }));
  }

  /**
   * @desc Observable function for find user by resetPassword token.
   * @param token: string - the token of the specific user.
   * @return User - success or failure
   */

  public findByResetPassword (token: string): Observable<User> {
    return from(this.manager.findOne(User, { resetPassword: token }));
  }

  /**
   * @desc Observable function for determine if user exist.
   * @param id: string - the id of the specific user.
   * @return boolean - success or failure
   */

  public userExist (id: string): Observable<boolean> {
    return from(new Promise(async (resolve, reject) => {
      try {
        const user = await this.findById(id);
        resolve(user ? true : false);
      } catch (error) {
        reject(error);
      }
    }));
  }
  /**
   * @desc Observable function for determine if user exist.
   * @param id: string - the id of the specific user.
   * @return boolean - success or failure
   */

  public findAll (): Observable<User[]> {
    return from(new Promise(async (resolve, reject) => {
      try {
        resolve(await this.manager.find(User));
      } catch (error) {
        reject(error);
      }
    }));
  }

  public create (user: User): Observable<User> {
    return from(new Promise(async (resolve, reject) => {
      try {
        const field: User = await this.manager.create(User, user);
        field.password = await this.hashPassword(field.password);
        await this.validateUser(field);
        const result = await this.manager.save(field);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }));
  }

  public update (id: string, att: User): Observable<User> {
    return from(new Promise(async (resolve, reject) => {
      try {
        if (att.password) { att.password = await this.hashPassword(att.password); }
        const fields = this.manager.create(User, att);
        await this.validateUser(fields, true);
        const t = await this.manager.update(User, id, att);
        resolve(await this.findById(id).toPromise());
      } catch (error) {
        reject(error);
      }
    }));
  }

  public delete (id: string): Observable<boolean> {
    return from(new Promise(async (resolve, reject) => {
      try {
        await this.manager.delete(User, id);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    }));
  }

//   public login (username: string, password: string): Observable<IToken> {
//     return from(new Promise(async (resolve, reject) => {
//       try {
//         const user: User = await this.findByUsernameOrEmail(username).toPromise();
//         await this.comparePassword(password, user.password).toPromise();
//         const authToken = new Auth();
//         await authToken.generateToken(user.id.toString(), 12);
//         resolve(authToken.getToken());
//       } catch (error) {
//         console.log(error);
//         reject(new Error('Username/Email o Contraseña es incorrecto'));
//       }
//     }));
//   }

//   public forgetPassword (username: string): Observable<string> {
//     return from(new Promise(async (resolve, reject) => {
//       try {
//         const user: User = await this.findByUsernameOrEmail(username).toPromise();
//         const now = moment().tz('America/Guayaquil').format();
//         user.resetPassword = crypto.randomBytes(68).toString('hex');
//         user.resetExpire = moment(now).add(24, 'h').toDate();
//         await this.update(user.id.toString(), user).toPromise();
//         const emailRepository: Email = new Email();
//         await emailRepository.resetPassword(user, ``, ``);
//         resolve('Revisa tu email para poder cambiar tu password.');
//       } catch (error) {
//         reject(error);
//       }
//     }));
//   }

  public resetPasswordByToken (token: string, password: string): Observable<string> {
    return from(new Promise(async (resolve, reject) => {
      try {
        const user: User = await this.findByResetPassword(token).toPromise();
        user.password = password;
        await this.update(user.id.toString(), user).toPromise();
        resolve(`Password fue cambiado correctamente`);
      } catch (error) {
        reject(error);
      }
    }));
  }

  private validateUser (user: User, skip = false): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        const error = await validate(user, { skipMissingProperties: skip });
        if (error.length > 0) {
          const message = error.map((e) => `${values(e.constraints)}`).toString();
          throw new Error(`${message}`);
        } else {
          resolve(true);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  private compareForChangePassword (password: string, hash: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        resolve(await bcrypt.compare(password, hash));
      } catch (error) {
        reject(error);
      }
    });
  }

  private comparePassword (password: string, hash: string): Observable<boolean> {
    return from(new Promise(async (resolve, reject) => {
      try {
        const pass: boolean = await bcrypt.compare(password, hash);
        resolve(pass);
      } catch (error) {
        console.log('error', error);
        reject(error);
      }
    }));
  }

  private hashPassword (password: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        resolve(await bcrypt.hash(password, this.saltRounds));
      } catch (error) {
        reject(error);
      }
    });
  }
}

export { UserRepository };
