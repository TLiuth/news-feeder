import { IsNotEmpty, IsString } from "class-validator";


export class IngestNewsDto {

    @IsNotEmpty()
    country: string;

    @IsNotEmpty()
    theme: string;

    @IsString()
    dryRun: string;
}