import { Client } from '@microsoft/microsoft-graph-client';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials';
import { DefaultAzureCredential } from '@azure/identity';

// Initialize Microsoft Graph Client for Power Automate
const credential = new DefaultAzureCredential();
const authProvider = new TokenCredentialAuthenticationProvider(credential, {
  scopes: ['https://graph.microsoft.com/.default']
});

const graphClient = Client.initWithMiddleware({
  authProvider
});

export const powerAutomateService = {
  // Project Creation Workflow
  async triggerProjectCreation(projectData: any) {
    try {
      await graphClient
        .api('/sites/{site-id}/lists/{list-id}/items')
        .post({
          fields: {
            Title: projectData.name,
            ProjectType: projectData.type,
            Status: 'New',
            StartDate: projectData.startDate,
            EndDate: projectData.endDate
          }
        });
    } catch (error) {
      logger.error('Failed to trigger project creation:', error);
      throw error;
    }
  },

  // Document Processing Workflow
  async triggerDocumentProcessing(documentId: string) {
    try {
      await graphClient
        .api('/sites/{site-id}/lists/{list-id}/items')
        .post({
          fields: {
            DocumentId: documentId,
            Status: 'Processing',
            ProcessedBy: 'AI Agent'
          }
        });
    } catch (error) {
      logger.error('Failed to trigger document processing:', error);
      throw error;
    }
  },

  // Notification Workflow
  async sendNotification(notificationData: any) {
    try {
      await graphClient
        .api('/sites/{site-id}/lists/{list-id}/items')
        .post({
          fields: {
            Title: notificationData.title,
            Message: notificationData.message,
            Recipients: notificationData.recipients,
            Priority: notificationData.priority
          }
        });
    } catch (error) {
      logger.error('Failed to send notification:', error);
      throw error;
    }
  },

  // Quality Check Workflow
  async triggerQualityCheck(projectId: string) {
    try {
      await graphClient
        .api('/sites/{site-id}/lists/{list-id}/items')
        .post({
          fields: {
            ProjectId: projectId,
            CheckType: 'Quality',
            Status: 'Pending',
            AssignedTo: 'Quality Assurance Agent'
          }
        });
    } catch (error) {
      logger.error('Failed to trigger quality check:', error);
      throw error;
    }
  },

  // Maintenance Workflow
  async triggerMaintenanceCheck(systemId: string) {
    try {
      await graphClient
        .api('/sites/{site-id}/lists/{list-id}/items')
        .post({
          fields: {
            SystemId: systemId,
            CheckType: 'Maintenance',
            Status: 'Pending',
            AssignedTo: 'Maintenance Agent'
          }
        });
    } catch (error) {
      logger.error('Failed to trigger maintenance check:', error);
      throw error;
    }
  }
}; 