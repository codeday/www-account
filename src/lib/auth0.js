import { ManagementClient } from 'auth0';

export const managementApi = new ManagementClient({
  domain: process.env.AUTH0_MANAGEMENT_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  scope: 'read:users read:roles update:users',
});
