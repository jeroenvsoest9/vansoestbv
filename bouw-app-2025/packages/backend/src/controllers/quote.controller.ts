import { Request, Response, NextFunction } from "express";
import { Quote } from "@models/quote.model";
import { AppError } from "@utils/errorHandler";
import { logger } from "@utils/logger";

export const quoteController = {
  async createQuote(req: Request, res: Response, next: NextFunction) {
    try {
      const quote = await Quote.create(req.body);
      logger.info(`Quote created: ${quote._id}`);
      res.status(201).json(quote);
    } catch (error) {
      next(new AppError("Failed to create quote", 500));
    }
  },

  async getQuotes(req: Request, res: Response, next: NextFunction) {
    try {
      const quotes = await Quote.find();
      res.status(200).json(quotes);
    } catch (error) {
      next(new AppError("Failed to fetch quotes", 500));
    }
  },

  async getQuoteById(req: Request, res: Response, next: NextFunction) {
    try {
      const quote = await Quote.findById(req.params.id);
      if (!quote) {
        return next(new AppError("Quote not found", 404));
      }
      res.status(200).json(quote);
    } catch (error) {
      next(new AppError("Failed to fetch quote", 500));
    }
  },

  async updateQuote(req: Request, res: Response, next: NextFunction) {
    try {
      const quote = await Quote.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!quote) {
        return next(new AppError("Quote not found", 404));
      }
      logger.info(`Quote updated: ${quote._id}`);
      res.status(200).json(quote);
    } catch (error) {
      next(new AppError("Failed to update quote", 500));
    }
  },

  async deleteQuote(req: Request, res: Response, next: NextFunction) {
    try {
      const quote = await Quote.findByIdAndDelete(req.params.id);
      if (!quote) {
        return next(new AppError("Quote not found", 404));
      }
      logger.info(`Quote deleted: ${quote._id}`);
      res.status(204).send();
    } catch (error) {
      next(new AppError("Failed to delete quote", 500));
    }
  },
};
