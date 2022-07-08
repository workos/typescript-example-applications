export interface UpdateOrganizationOptions {
    organization: string;
    name: string;
    allow_profiles_outside_organization?: boolean;
    domains?: string[];
}
