const config = {
  teamsAppId: process.env.TEAMS_APP_ID,
  authorityHost: process.env.M365_AUTHORITY_HOST,
  tenantId: process.env.M365_TENANT_ID,
  clientId: process.env.M365_CLIENT_ID,
  clientSecret: process.env.M365_CLIENT_SECRET,
  oaiApiKey: process.env.OAI_API_KEY,
  oaiEndpoint: process.env.OAI_ENDPOINT,
  oaiUrl: process.env.OAI_URL,
};

export default config;
