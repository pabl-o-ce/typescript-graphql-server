// import { IToken } from '../../interface';
import { User } from './entity';
import { UserRepository } from './repository';

const UserResolver = {
    Query: {
        user (root, args, ctx): Promise<User> {
            const repository: UserRepository = ctx.db.getCustomRepository(UserRepository);
            return repository.findByIdOrEmail(args.id).toPromise();
        },
        users (root, args, ctx): Promise<User[]> {
            const repository: UserRepository = ctx.db.getCustomRepository(UserRepository);
            return repository.findAll().toPromise();
        },
    },
    Mutation: {

        createUser (root, args, ctx): Promise<User> {
            const repository: UserRepository = ctx.db.getCustomRepository(UserRepository);
            return repository.create(args.user).toPromise();
        },

        updateUser (root, args, ctx): Promise<User> {
            const repository: UserRepository = ctx.db.getCustomRepository(UserRepository);
            return repository.update(args.id, args.user).toPromise();
        },

        deleteUser (root, args, ctx): Promise<boolean> {
            const repository: UserRepository = ctx.db.getCustomRepository(UserRepository);
            return repository.delete(args.id).toPromise();
        },

        // login (root, args, ctx): Promise<IToken> {
        //     const repository: UserRepository = ctx.db.getCustomRepository(UserRepository);
        //     return repository.login(args.input.username, args.input.password).toPromise();
        // },

        // forgetPassword (root, args, ctx): Promise<string> {
        //     const repository: UserRepository = ctx.db.getCustomRepository(UserRepository);
        //     return repository.forgetPassword(args.username).toPromise();
        // },

        resetPassword (root, args, ctx): Promise<string> {
            const repository: UserRepository = ctx.db.getCustomRepository(UserRepository);
            return repository.resetPasswordByToken(args.token, args.password).toPromise();
        },
    },
};

export { UserResolver };
