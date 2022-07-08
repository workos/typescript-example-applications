import { List } from '../common/interfaces/list.interface';
import { WorkOS } from '../workos';
import { CreateOrganizationOptions, ListOrganizationsOptions, Organization, UpdateOrganizationOptions } from './interfaces';
export declare class Organizations {
    private readonly workos;
    constructor(workos: WorkOS);
    listOrganizations(options?: ListOrganizationsOptions): Promise<List<Organization>>;
    createOrganization(payload: CreateOrganizationOptions): Promise<Organization>;
    deleteOrganization(id: string): Promise<void>;
    getOrganization(id: string): Promise<Organization>;
    updateOrganization(options: UpdateOrganizationOptions): Promise<Organization>;
}
