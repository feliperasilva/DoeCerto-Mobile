import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator";
import { IsCPF } from "@sh4rkzy/brazilian-validator";

export class RegisterDonorDto {

    @IsString()
    @IsNotEmpty({ message: 'Name should not be empty' })
    @MaxLength(100, { message: 'Name is too long' })
    name: string;

    @IsEmail({}, { message: 'Invalid email address' })
    @IsNotEmpty({ message: 'Email should not be empty' })
    @MaxLength(254, { message: 'Email is too long' })
    email: string;

    @IsString()
    @IsNotEmpty({ message: 'Password should not be empty' })
    @MaxLength(8, { message: 'Password is too long' })
    password: string;

    @IsCPF({ message: 'Invalid CPF' })
    @IsNotEmpty({ message: 'CPF should not be empty' })
    cpf: string;      
}