import { Profile } from "@workos-inc/node/lib/sso/interfaces/profile.interface";

declare module "express-session" {
    export interface SessionData {
        isloggedin?: boolean;
        profile: Profile;
        first_name: string;
    }
}

export{}