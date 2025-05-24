import { Request, Response } from 'express';
import { MenuModel } from '../models/Menu';
import logger from '../config/logger';

export class MenuController {
  private menuModel: MenuModel;

  constructor() {
    this.menuModel = new MenuModel();
  }

  async create(req: Request, res: Response) {
    try {
      const { name, location, items } = req.body;
      const userId = req.user?.uid;

      if (!userId) {
        throw new Error('User not authenticated');
      }

      const menu = await this.menuModel.create({
        name,
        location,
        items,
        createdBy: userId,
        updatedBy: userId,
      });

      res.status(201).json({
        success: true,
        data: {
          menu,
        },
      });
    } catch (error: any) {
      logger.error('Error in create menu:', error);
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const menu = await this.menuModel.findById(id);

      if (!menu) {
        return res.status(404).json({
          success: false,
          error: 'Menu not found',
        });
      }

      res.status(200).json({
        success: true,
        data: {
          menu,
        },
      });
    } catch (error: any) {
      logger.error('Error in get menu by id:', error);
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async getByLocation(req: Request, res: Response) {
    try {
      const { location } = req.params;
      const menu = await this.menuModel.findByLocation(location);

      if (!menu) {
        return res.status(404).json({
          success: false,
          error: 'Menu not found',
        });
      }

      res.status(200).json({
        success: true,
        data: {
          menu,
        },
      });
    } catch (error: any) {
      logger.error('Error in get menu by location:', error);
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, location, items } = req.body;
      const userId = req.user?.uid;

      if (!userId) {
        throw new Error('User not authenticated');
      }

      const menu = await this.menuModel.update(id, {
        name,
        location,
        items,
        updatedBy: userId,
      });

      if (!menu) {
        return res.status(404).json({
          success: false,
          error: 'Menu not found',
        });
      }

      res.status(200).json({
        success: true,
        data: {
          menu,
        },
      });
    } catch (error: any) {
      logger.error('Error in update menu:', error);
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const success = await this.menuModel.delete(id);

      if (!success) {
        return res.status(404).json({
          success: false,
          error: 'Menu not found',
        });
      }

      res.status(200).json({
        success: true,
        message: 'Menu deleted successfully',
      });
    } catch (error: any) {
      logger.error('Error in delete menu:', error);
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const menus = await this.menuModel.list();
      res.status(200).json({
        success: true,
        data: {
          menus,
        },
      });
    } catch (error: any) {
      logger.error('Error in list menus:', error);
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async addMenuItem(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, url, target, icon, order, parent } = req.body;
      const userId = req.user?.uid;

      if (!userId) {
        throw new Error('User not authenticated');
      }

      const menu = await this.menuModel.addMenuItem(id, {
        title,
        url,
        target,
        icon,
        order,
        parent,
      });

      if (!menu) {
        return res.status(404).json({
          success: false,
          error: 'Menu not found',
        });
      }

      res.status(200).json({
        success: true,
        data: {
          menu,
        },
      });
    } catch (error: any) {
      logger.error('Error in add menu item:', error);
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async updateMenuItem(req: Request, res: Response) {
    try {
      const { id, itemId } = req.params;
      const { title, url, target, icon, order, parent } = req.body;
      const userId = req.user?.uid;

      if (!userId) {
        throw new Error('User not authenticated');
      }

      const menu = await this.menuModel.updateMenuItem(id, itemId, {
        title,
        url,
        target,
        icon,
        order,
        parent,
      });

      if (!menu) {
        return res.status(404).json({
          success: false,
          error: 'Menu or menu item not found',
        });
      }

      res.status(200).json({
        success: true,
        data: {
          menu,
        },
      });
    } catch (error: any) {
      logger.error('Error in update menu item:', error);
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async deleteMenuItem(req: Request, res: Response) {
    try {
      const { id, itemId } = req.params;
      const menu = await this.menuModel.deleteMenuItem(id, itemId);

      if (!menu) {
        return res.status(404).json({
          success: false,
          error: 'Menu or menu item not found',
        });
      }

      res.status(200).json({
        success: true,
        data: {
          menu,
        },
      });
    } catch (error: any) {
      logger.error('Error in delete menu item:', error);
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async reorderItems(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { itemIds } = req.body;
      const userId = req.user?.uid;

      if (!userId) {
        throw new Error('User not authenticated');
      }

      const menu = await this.menuModel.reorderItems(id, itemIds);

      if (!menu) {
        return res.status(404).json({
          success: false,
          error: 'Menu not found',
        });
      }

      res.status(200).json({
        success: true,
        data: {
          menu,
        },
      });
    } catch (error: any) {
      logger.error('Error in reorder menu items:', error);
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
}
