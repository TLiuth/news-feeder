import { ThemeEntity } from "src/modules/themes/entities/theme.entity";
export declare class UserEntity {
    id: number;
    name: string;
    email: string;
    emailVerified: boolean;
    subscriptionPreference: any;
    telephone: string;
    themes: ThemeEntity[];
    lastEmailSent: Date;
    createdAt: Date;
    updatedAt: Date;
}
