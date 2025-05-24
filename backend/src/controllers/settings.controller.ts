import { Request, Response, NextFunction } from 'express';
import { SettingsModel } from '../models/Settings';
import { adminStorage } from '../config/firebase';
import logger from '../config/logger';

export class SettingsController {
  private settingsModel: SettingsModel;

  constructor() {
    this.settingsModel = new SettingsModel();
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const settings = await this.settingsModel.get();
      if (!settings) {
        const err = new Error('Settings not found');
        (err as any).status = 404;
        throw err;
      }
      res.status(200).json({ success: true, data: { settings } });
    } catch (error) {
      logger.error('Error in get settings:', error);
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { siteName, siteDescription, theme, seo, social, contact, features } = req.body;
      const userId = req.user?.uid;
      if (!userId) throw new Error('User not authenticated');

      // Handle logo upload if present
      let logo;
      if (req.files?.logo) {
        const file = req.files.logo as any;
        const bucket = adminStorage.bucket();
        const logoFile = bucket.file(`settings/logo/${Date.now()}-${file.name}`);
        await logoFile.save(file.data, { metadata: { contentType: file.mimetype } });
        logo = logoFile.publicUrl();
      }

      // Handle favicon upload if present
      let favicon;
      if (req.files?.favicon) {
        const file = req.files.favicon as any;
        const bucket = adminStorage.bucket();
        const faviconFile = bucket.file(`settings/favicon/${Date.now()}-${file.name}`);
        await faviconFile.save(file.data, { metadata: { contentType: file.mimetype } });
        favicon = faviconFile.publicUrl();
      }

      const settings = await this.settingsModel.update({
        siteName, siteDescription, logo, favicon, theme, seo, social, contact, features, updatedBy: userId
      });

      if (!settings) {
        const err = new Error('Settings not found');
        (err as any).status = 404;
        throw err;
      }

      res.status(200).json({ success: true, data: { settings } });
    } catch (error) {
      logger.error('Error in update settings:', error);
      next(error);
    }
  }

  async initialize(req: Request, res: Response, next: NextFunction) {
    try {
      const { siteName, siteDescription, theme, seo, social, contact, features } = req.body;
      const userId = req.user?.uid;
      if (!userId) throw new Error('User not authenticated');

      // Handle logo upload if present
      let logo;
      if (req.files?.logo) {
        const file = req.files.logo as any;
        const bucket = adminStorage.bucket();
        const logoFile = bucket.file(`settings/logo/${Date.now()}-${file.name}`);
        await logoFile.save(file.data, { metadata: { contentType: file.mimetype } });
        logo = logoFile.publicUrl();
      }

      // Handle favicon upload if present
      let favicon;
      if (req.files?.favicon) {
        const file = req.files.favicon as any;
        const bucket = adminStorage.bucket();
        const faviconFile = bucket.file(`settings/favicon/${Date.now()}-${file.name}`);
        await faviconFile.save(file.data, { metadata: { contentType: file.mimetype } });
        favicon = faviconFile.publicUrl();
      }

      const settings = await this.settingsModel.initialize({
        siteName, siteDescription, logo, favicon, theme, seo, social, contact, features,
        createdBy: userId, updatedBy: userId
      });

      res.status(201).json({ success: true, data: { settings } });
    } catch (error) {
      logger.error('Error in initialize settings:', error);
      next(error);
    }
  }

  async reset(req: Request, res: Response, next: NextFunction) {
    try {
      const settings = await this.settingsModel.reset();
      if (!settings) {
        const err = new Error('Settings not found');
        (err as any).status = 404;
        throw err;
      }
      res.status(200).json({ success: true, data: { settings } });
    } catch (error) {
      logger.error('Error in reset settings:', error);
      next(error);
    }
  }
}
