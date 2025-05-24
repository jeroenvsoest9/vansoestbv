import { Client } from '@microsoft/microsoft-graph-client';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials';
import { DefaultAzureCredential } from '@azure/identity';
import { logger } from '@utils/logger';

// Initialize Microsoft Graph Client for Teams
const credential = new DefaultAzureCredential();
const authProvider = new TokenCredentialAuthenticationProvider(credential, {
  scopes: ['https://graph.microsoft.com/.default']
});

const graphClient = Client.initWithMiddleware({
  authProvider
});

export const teamsService = {
  // Create Project Team
  async createProjectTeam(projectData: any) {
    try {
      const team = await graphClient
        .api('/teams')
        .post({
          template: 'standard',
          displayName: `Project: ${projectData.name}`,
          description: projectData.description,
          members: projectData.teamMembers.map((member: any) => ({
            '@odata.type': '#microsoft.graph.aadUserConversationMember',
            roles: [member.role],
            'user@odata.bind': `https://graph.microsoft.com/v1.0/users/${member.id}`
          }))
        });

      // Create channels
      await this.createTeamChannels(team.id, [
        'Algemeen',
        'Planning',
        'Documenten',
        'Kwaliteit',
        'Veiligheid'
      ]);

      return team;
    } catch (error) {
      logger.error('Failed to create project team:', error);
      throw error;
    }
  },

  // Create Team Channels
  async createTeamChannels(teamId: string, channelNames: string[]) {
    try {
      for (const name of channelNames) {
        await graphClient
          .api(`/teams/${teamId}/channels`)
          .post({
            displayName: name,
            description: `${name} channel for project discussions`
          });
      }
    } catch (error) {
      logger.error('Failed to create team channels:', error);
      throw error;
    }
  },

  // Send Team Message
  async sendTeamMessage(teamId: string, channelId: string, message: string) {
    try {
      await graphClient
        .api(`/teams/${teamId}/channels/${channelId}/messages`)
        .post({
          body: {
            content: message
          }
        });
    } catch (error) {
      logger.error('Failed to send team message:', error);
      throw error;
    }
  },

  // Schedule Team Meeting
  async scheduleTeamMeeting(teamId: string, meetingData: any) {
    try {
      const meeting = await graphClient
        .api(`/teams/${teamId}/schedule/events`)
        .post({
          subject: meetingData.subject,
          start: {
            dateTime: meetingData.startTime,
            timeZone: 'UTC'
          },
          end: {
            dateTime: meetingData.endTime,
            timeZone: 'UTC'
          },
          location: {
            displayName: 'Microsoft Teams Meeting'
          },
          attendees: meetingData.attendees.map((attendee: any) => ({
            emailAddress: {
              address: attendee.email,
              name: attendee.name
            },
            type: 'required'
          }))
        });

      return meeting;
    } catch (error) {
      logger.error('Failed to schedule team meeting:', error);
      throw error;
    }
  }
}; 