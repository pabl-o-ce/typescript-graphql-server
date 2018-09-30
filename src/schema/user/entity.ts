import { IsDate, IsEmail, IsInt, IsOptional, MaxLength } from 'class-validator';
import { Column, CreateDateColumn, Entity, Generated, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('user')
export class User {

    @PrimaryColumn('varchar')
    @Generated('uuid')
    id: string;

    @Column('varchar', {unique: true})
    @MaxLength(20, { message: 'Username supero el tamaño permitido de $constraint1 caracteres'})
    username: string;

    @Column('varchar', {unique: true})
    @IsEmail(undefined, { message: 'Email $value es invalido' })
    email: string;

    @Column('varchar', {select: false})
    password: string;

    @Column('varchar', {})
    @MaxLength(40)
    firstname: string;

    @Column('varchar', {})
    @MaxLength(60)
    lastname: string;

    @Column('varchar', { name: 'reset_password', nullable: true, select: false })
    resetPassword: string;

    @Column('datetime', { name: 'reset_expire', nullable: true, select: false })
    @IsOptional()
    @IsDate()
    resetExpire: Date;

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

    @Column('datetime', { nullable: true, select: false })
    deletedAt: Date;

}
