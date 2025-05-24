import axios from 'axios';

interface SocialMediaConfig {
  appId: string;
  appSecret: string;
  accessToken: string;
}

interface PostData {
  caption?: string;
  message?: string;
  mediaUrl?: string;
  link?: string;
  hashtags?: string[];
  scheduledPublishTime?: Date;
  publishTime?: Date;
  meta?: {
    description?: string;
    keywords?: string[];
  };
}

export class FacebookApi {
  private config: SocialMediaConfig;
  private baseUrl = 'https://graph.facebook.com/v18.0';

  constructor(config: SocialMediaConfig) {
    this.config = config;
  }

  async createPost(data: PostData): Promise<void> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/me/feed`,
        {
          message: data.message,
          link: data.link,
          scheduled_publish_time: data.scheduledPublishTime?.getTime() / 1000,
        },
        {
          params: {
            access_token: this.config.accessToken,
          },
        }
      );

      if (response.status !== 200) {
        throw new Error('Failed to create Facebook post');
      }
    } catch (error) {
      console.error('Facebook API Error:', error);
      throw error;
    }
  }

  async schedulePost(data: PostData): Promise<void> {
    return this.createPost(data);
  }

  async getAnalytics(startDate: Date, endDate: Date): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/me/insights`, {
        params: {
          access_token: this.config.accessToken,
          metric: 'page_impressions,page_engaged_users',
          period: 'day',
          since: startDate.toISOString(),
          until: endDate.toISOString(),
        },
      });

      return response.data;
    } catch (error) {
      console.error('Facebook Analytics Error:', error);
      throw error;
    }
  }

  async getAudienceInsights(): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/me/insights`, {
        params: {
          access_token: this.config.accessToken,
          metric: 'page_fans_country,page_fans_city,page_fans_gender_age',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Facebook Audience Insights Error:', error);
      throw error;
    }
  }
}

export class InstagramApi {
  private config: SocialMediaConfig;
  private baseUrl = 'https://graph.facebook.com/v18.0';

  constructor(config: SocialMediaConfig) {
    this.config = config;
  }

  async createPost(data: PostData): Promise<void> {
    try {
      // Eerst media uploaden als er een afbeelding is
      let mediaId;
      if (data.mediaUrl) {
        const mediaResponse = await axios.post(`${this.baseUrl}/me/media`, {
          image_url: data.mediaUrl,
          caption: data.caption,
          access_token: this.config.accessToken,
        });
        mediaId = mediaResponse.data.id;
      }

      // Dan de post publiceren
      const response = await axios.post(`${this.baseUrl}/me/media_publish`, {
        creation_id: mediaId,
        access_token: this.config.accessToken,
      });

      if (response.status !== 200) {
        throw new Error('Failed to create Instagram post');
      }
    } catch (error) {
      console.error('Instagram API Error:', error);
      throw error;
    }
  }

  async schedulePost(data: PostData): Promise<void> {
    try {
      const response = await axios.post(`${this.baseUrl}/me/media`, {
        image_url: data.mediaUrl,
        caption: data.caption,
        scheduled_publish_time: data.publishTime?.getTime() / 1000,
        access_token: this.config.accessToken,
      });

      if (response.status !== 200) {
        throw new Error('Failed to schedule Instagram post');
      }
    } catch (error) {
      console.error('Instagram Scheduling Error:', error);
      throw error;
    }
  }

  async getAnalytics(startDate: Date, endDate: Date): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/me/insights`, {
        params: {
          access_token: this.config.accessToken,
          metric: 'impressions,reach,engagement',
          period: 'day',
          since: startDate.toISOString(),
          until: endDate.toISOString(),
        },
      });

      return response.data;
    } catch (error) {
      console.error('Instagram Analytics Error:', error);
      throw error;
    }
  }

  async getAudienceInsights(): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/me/insights`, {
        params: {
          access_token: this.config.accessToken,
          metric: 'audience_country,audience_city,audience_gender_age',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Instagram Audience Insights Error:', error);
      throw error;
    }
  }
}
