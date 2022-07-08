import { List } from '../common/interfaces/list.interface';
import { WorkOS } from '../workos';
import { AuthorizationURLOptions } from './interfaces/authorization-url-options.interface';
import { Connection } from './interfaces/connection.interface';
import { GetProfileAndTokenOptions } from './interfaces/get-profile-and-token-options.interface';
import { GetProfileOptions } from './interfaces/get-profile-options.interface';
import { ListConnectionsOptions } from './interfaces/list-connections-options.interface';
import { ProfileAndToken } from './interfaces/profile-and-token.interface';
import { Profile } from './interfaces/profile.interface';
export declare class SSO {
    private readonly workos;
    constructor(workos: WorkOS);
    deleteConnection(id: string): Promise<void>;
    getAuthorizationURL({ connection, clientID, domain, domainHint, loginHint, organization, provider, redirectURI, state, }: AuthorizationURLOptions): string;
    getConnection(id: string): Promise<Connection>;
    getProfileAndToken({ code, clientID, }: GetProfileAndTokenOptions): Promise<ProfileAndToken>;
    getProfile({ accessToken }: GetProfileOptions): Promise<Profile>;
    listConnections(options?: ListConnectionsOptions): Promise<List<Connection>>;
}
