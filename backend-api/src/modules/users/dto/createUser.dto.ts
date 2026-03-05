import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";


export class CreateUserDto  {
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsOptional()
    telephone: string;
}