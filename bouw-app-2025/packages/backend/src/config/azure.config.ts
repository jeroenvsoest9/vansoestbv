import { Client } from '@microsoft/microsoft-graph-client';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials';
import { DefaultAzureCredential } from '@azure/identity';
import { BlobServiceClient } from '@azure/storage-blob';

// Azure AD Configuration
export const azureConfig = {
  tenantId: process.env.AZURE_TENANT_ID,
  clientId: process.env.AZURE_CLIENT_ID,
  clientSecret: process.env.AZURE_CLIENT_SECRET,
  redirectUri: process.env.AZURE_REDIRECT_URI
};

// SharePoint Configuration
export const sharepointConfig = {
  siteId: process.env.SHAREPOINT_SITE_ID,
  documentLibrary: 'Projecten'
};

// Initialize Microsoft Graph Client
const credential = new DefaultAzureCredential();
const authProvider = new TokenCredentialAuthenticationProvider(credential, {
  scopes: ['https://graph.microsoft.com/.default']
});

export const graphClient = Client.initWithMiddleware({
  authProvider
});

// Initialize Azure Storage Client
export const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);

// Helper functions for SharePoint operations
export const sharepointService = {
  async createProjectFolder(projectName: string) {
    const folderPath = `${sharepointConfig.documentLibrary}/${projectName}`;
    await graphClient
      .api(`/sites/${sharepointConfig.siteId}/drive/root:/${folderPath}`)
      .createFolder();
    return folderPath;
  },

  async uploadDocument(folderPath: string, fileName: string, content: Buffer) {
    await graphClient
      .api(`/sites/${sharepointConfig.siteId}/drive/root:/${folderPath}/${fileName}:/content`)
      .put(content);
  }
}; 