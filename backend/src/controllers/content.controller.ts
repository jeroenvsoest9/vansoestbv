import { Request, Response } from 'express';
import { ContentModel } from '../models/Content';
import { adminStorage } from '../config/firebase';
import logger from '../config/logger';

export class ContentController {
  private contentModel: ContentModel;

  constructor() {
    this.contentModel = new ContentModel();
  }

  async create(req: Request, res: Response) {
    try {
      const { title, slug, type, content, excerpt, tags, meta } = req.body;
      const author = req.user?.uid;

      if (!author) {
        throw new Error('User not authenticated');
      }

      // Handle featured image upload if present
      let featuredImage;
      if (req.file) {
        const bucket = adminStorage.bucket();
        const file = bucket.file(`content/${Date.now()}-${req.file.originalname}`);
        await file.save(req.file.buffer, {
          metadata: {
            contentType: req.file.mimetype,
          },
        });
        featuredImage = file.publicUrl();
      }

      const newContent = await this.contentModel.create({
        title,
        slug,
        type,
        content,
        excerpt,
        featuredImage,
        author,
        tags,
        meta,
        status: 'draft',
      });

      res.status(201).json({
        success: true,
        data: {
          content: newContent,
        },
      });
    } catch (error: any) {
      logger.error('Error in create content:', error);
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const content = await this.contentModel.findById(id);

      if (!content) {
        return res.status(404).json({
          success: false,
          error: 'Content not found',
        });
      }

      res.status(200).json({
        success: true,
        data: {
          content,
        },
      });
    } catch (error: any) {
      logger.error('Error in get content by id:', error);
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async getBySlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      const content = await this.contentModel.findBySlug(slug);

      if (!content) {
        return res.status(404).json({
          success: false,
          error: 'Content not found',
        });
      }

      res.status(200).json({
        success: true,
        data: {
          content,
        },
      });
    } catch (error: any) {
      logger.error('Error in get content by slug:', error);
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, slug, content, excerpt, tags, meta } = req.body;

      // Handle featured image upload if present
      let featuredImage;
      if (req.file) {
        const bucket = adminStorage.bucket();
        const file = bucket.file(`content/${Date.now()}-${req.file.originalname}`);
        await file.save(req.file.buffer, {
          metadata: {
            contentType: req.file.mimetype,
          },
        });
        featuredImage = file.publicUrl();
      }

      const updatedContent = await this.contentModel.update(id, {
        title,
        slug,
        content,
        excerpt,
        featuredImage,
        tags,
        meta,
      });

      if (!updatedContent) {
        return res.status(404).json({
          success: false,
          error: 'Content not found',
        });
      }

      res.status(200).json({
        success: true,
        data: {
          content: updatedContent,
        },
      });
    } catch (error: any) {
      logger.error('Error in update content:', error);
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const success = await this.contentModel.delete(id);

      if (!success) {
        return res.status(404).json({
          success: false,
          error: 'Content not found',
        });
      }

      res.status(200).json({
        success: true,
        message: 'Content deleted successfully',
      });
    } catch (error: any) {
      logger.error('Error in delete content:', error);
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const { type, status, author, tag } = req.query;
      const content = await this.contentModel.list({
        type: type as any,
        status: status as any,
        author: author as string,
        tag: tag as string,
      });

      res.status(200).json({
        success: true,
        data: {
          content,
        },
      });
    } catch (error: any) {
      logger.error('Error in list content:', error);
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async publish(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const content = await this.contentModel.publish(id);

      if (!content) {
        return res.status(404).json({
          success: false,
          error: 'Content not found',
        });
      }

      res.status(200).json({
        success: true,
        data: {
          content,
        },
      });
    } catch (error: any) {
      logger.error('Error in publish content:', error);
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async archive(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const content = await this.contentModel.archive(id);

      if (!content) {
        return res.status(404).json({
          success: false,
          error: 'Content not found',
        });
      }

      res.status(200).json({
        success: true,
        data: {
          content,
        },
      });
    } catch (error: any) {
      logger.error('Error in archive content:', error);
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
}
