import { FacebookApi, InstagramApi } from '../config/social-media';
import { ContentModel, Content } from '../models/Content';
import logger from '../config/logger';

export class SocialMediaService {
  private facebookApi: FacebookApi;
  private instagramApi: InstagramApi;
  private contentModel: ContentModel;

  constructor() {
    this.facebookApi = new FacebookApi({
      appId: process.env.FACEBOOK_APP_ID!,
      appSecret: process.env.FACEBOOK_APP_SECRET!,
      accessToken: process.env.FACEBOOK_ACCESS_TOKEN!,
    });

    this.instagramApi = new InstagramApi({
      appId: process.env.INSTAGRAM_APP_ID!,
      appSecret: process.env.INSTAGRAM_APP_SECRET!,
      accessToken: process.env.INSTAGRAM_ACCESS_TOKEN!,
    });

    this.contentModel = new ContentModel();
  }

  async postToInstagram(content: Content): Promise<void> {
    try {
      const postData = {
        caption: content.content,
        mediaUrl: content.featuredImage,
        hashtags: content.meta?.keywords || [],
      };
      await this.instagramApi.createPost(postData);

      // Update content status in Firestore
      await this.contentModel.update(content.id, { status: 'published' });
    } catch (error) {
      logger.error('Error posting to Instagram:', error);
      throw error;
    }
  }

  async postToFacebook(content: Content): Promise<void> {
    try {
      const postData = {
        message: content.content,
        link: content.featuredImage,
        scheduledPublishTime: content.publishedAt,
      };
      await this.facebookApi.createPost(postData);

      // Update content status in Firestore
      await this.contentModel.update(content.id, { status: 'published' });
    } catch (error) {
      logger.error('Error posting to Facebook:', error);
      throw error;
    }
  }

  async scheduleContent(
    content: Content,
    platform: 'instagram' | 'facebook',
    publishTime: Date
  ): Promise<void> {
    try {
      const postData = {
        content: content.content,
        mediaUrl: content.featuredImage,
        publishTime,
        meta: content.meta,
      };

      if (platform === 'instagram') {
        await this.instagramApi.schedulePost(postData);
      } else {
        await this.facebookApi.schedulePost(postData);
      }

      // Update content status in Firestore
      await this.contentModel.update(content.id, { status: 'scheduled' });
    } catch (error) {
      logger.error(`Error scheduling content for ${platform}:`, error);
      throw error;
    }
  }

  async getAnalytics(
    platform: 'instagram' | 'facebook',
    startDate: Date,
    endDate: Date
  ): Promise<any> {
    try {
      if (platform === 'instagram') {
        return await this.instagramApi.getAnalytics(startDate, endDate);
      } else {
        return await this.facebookApi.getAnalytics(startDate, endDate);
      }
    } catch (error) {
      logger.error(`Error getting analytics for ${platform}:`, error);
      throw error;
    }
  }

  async getAudienceInsights(platform: 'instagram' | 'facebook'): Promise<any> {
    try {
      if (platform === 'instagram') {
        return await this.instagramApi.getAudienceInsights();
      } else {
        return await this.facebookApi.getAudienceInsights();
      }
    } catch (error) {
      logger.error(`Error getting audience insights for ${platform}:`, error);
      throw error;
    }
  }
}
