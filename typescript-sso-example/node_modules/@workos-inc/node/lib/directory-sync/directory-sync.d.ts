import { WorkOS } from '../workos';
import { Directory } from './interfaces/directory.interface';
import { List } from '../common/interfaces/list.interface';
import { Group } from './interfaces/group.interface';
import { DefaultCustomAttributes, UserWithGroups } from './interfaces/user.interface';
import { ListDirectoriesOptions } from './interfaces/list-directories-options.interface';
import { ListGroupsOptions } from './interfaces/list-groups-options.interface';
import { ListUsersOptions } from './interfaces/list-users-options.interface';
export declare class DirectorySync {
    private readonly workos;
    constructor(workos: WorkOS);
    listDirectories(options?: ListDirectoriesOptions): Promise<List<Directory>>;
    getDirectory(id: string): Promise<Directory>;
    deleteDirectory(id: string): Promise<void>;
    listGroups(options: ListGroupsOptions): Promise<List<Group>>;
    listUsers<TCustomAttributes extends object = DefaultCustomAttributes>(options: ListUsersOptions): Promise<List<UserWithGroups<TCustomAttributes>>>;
    getUser<TCustomAttributes extends object = DefaultCustomAttributes>(user: string): Promise<UserWithGroups<TCustomAttributes>>;
    getGroup(group: string): Promise<Group>;
}
