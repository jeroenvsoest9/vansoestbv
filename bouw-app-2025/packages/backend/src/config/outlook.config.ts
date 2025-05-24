import { Client } from '@microsoft/microsoft-graph-client';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials';
import { DefaultAzureCredential } from '@azure/identity';
import { logger } from '@utils/logger';

// Initialize Microsoft Graph Client for Outlook
const credential = new DefaultAzureCredential();
const authProvider = new TokenCredentialAuthenticationProvider(credential, {
  scopes: ['https://graph.microsoft.com/.default']
});

const graphClient = Client.initWithMiddleware({
  authProvider
});

export const outlookService = {
  // Send Email
  async sendEmail(emailData: any) {
    try {
      await graphClient
        .api('/users/me/sendMail')
        .post({
          message: {
            subject: emailData.subject,
            body: {
              contentType: 'HTML',
              content: emailData.content
            },
            toRecipients: emailData.recipients.map((recipient: any) => ({
              emailAddress: {
                address: recipient.email,
                name: recipient.name
              }
            })),
            attachments: emailData.attachments?.map((attachment: any) => ({
              '@odata.type': '#microsoft.graph.fileAttachment',
              name: attachment.name,
              contentBytes: attachment.content
            }))
          }
        });
    } catch (error) {
      logger.error('Failed to send email:', error);
      throw error;
    }
  },

  // Create Calendar Event
  async createCalendarEvent(eventData: any) {
    try {
      const event = await graphClient
        .api('/users/me/calendar/events')
        .post({
          subject: eventData.subject,
          body: {
            contentType: 'HTML',
            content: eventData.description
          },
          start: {
            dateTime: eventData.startTime,
            timeZone: 'UTC'
          },
          end: {
            dateTime: eventData.endTime,
            timeZone: 'UTC'
          },
          location: {
            displayName: eventData.location
          },
          attendees: eventData.attendees.map((attendee: any) => ({
            emailAddress: {
              address: attendee.email,
              name: attendee.name
            },
            type: 'required'
          })),
          categories: eventData.categories
        });

      return event;
    } catch (error) {
      logger.error('Failed to create calendar event:', error);
      throw error;
    }
  },

  // Create Task
  async createTask(taskData: any) {
    try {
      const task = await graphClient
        .api('/users/me/tasks')
        .post({
          subject: taskData.subject,
          body: {
            contentType: 'HTML',
            content: taskData.description
          },
          dueDateTime: {
            dateTime: taskData.dueDate,
            timeZone: 'UTC'
          },
          importance: taskData.importance,
          categories: taskData.categories
        });

      return task;
    } catch (error) {
      logger.error('Failed to create task:', error);
      throw error;
    }
  },

  // Send Meeting Invite
  async sendMeetingInvite(meetingData: any) {
    try {
      const meeting = await this.createCalendarEvent({
        ...meetingData,
        subject: `Meeting: ${meetingData.subject}`,
        categories: ['Meeting']
      });

      // Send confirmation email
      await this.sendEmail({
        subject: `Meeting Invitation: ${meetingData.subject}`,
        content: `
          <h2>Meeting Details</h2>
          <p>Subject: ${meetingData.subject}</p>
          <p>Date: ${meetingData.startTime}</p>
          <p>Location: ${meetingData.location}</p>
          <p>Please find the meeting invitation attached.</p>
        `,
        recipients: meetingData.attendees
      });

      return meeting;
    } catch (error) {
      logger.error('Failed to send meeting invite:', error);
      throw error;
    }
  }
}; 