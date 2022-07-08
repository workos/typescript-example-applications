import { WorkOS } from '../workos';
import { PasswordlessSession } from './interfaces/passwordless-session.interface';
import { CreatePasswordlessSessionOptions } from './interfaces/create-passwordless-session-options.interface';
import { SendSessionResponse } from './interfaces/send-session-response.interface';
export declare class Passwordless {
    private readonly workos;
    constructor(workos: WorkOS);
    createSession({ redirectURI, expiresIn, ...options }: CreatePasswordlessSessionOptions): Promise<PasswordlessSession>;
    sendSession(sessionId: string): Promise<SendSessionResponse>;
}
