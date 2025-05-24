import { Router } from 'express';
import { quoteController } from '@controllers/quote.controller';
import { validateQuoteRequest } from '@middleware/quote.validation';

const router = Router();

// Quote routes
router.post('/', validateQuoteRequest, quoteController.createQuote);
router.get('/', quoteController.getQuotes);
router.get('/:id', quoteController.getQuoteById);
router.put('/:id', validateQuoteRequest, quoteController.updateQuote);
router.delete('/:id', quoteController.deleteQuote);

export const quoteRoutes = router; 