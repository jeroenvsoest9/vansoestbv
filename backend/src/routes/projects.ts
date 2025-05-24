import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth';
import { ProjectsController } from '../controllers/projects.controller';

const router = Router();
const controller = new ProjectsController();

// Projecten ophalen (lijst)
router.get('/', authenticate, (req, res, next) => controller.getAll(req, res, next));

// Project aanmaken
router.post('/', [authenticate, requireRole(['admin', 'manager'])], (req, res, next) =>
  controller.submit(req, res, next)
);

// Project ophalen (detail)
router.get('/:id', authenticate, (req, res, next) => controller.get(req, res, next));

// Project bijwerken
router.put('/:id', [authenticate, requireRole(['admin', 'manager'])], (req, res, next) =>
  controller.update(req, res, next)
);

// Project verwijderen
router.delete('/:id', [authenticate, requireRole(['admin'])], (req, res, next) =>
  controller.delete(req, res, next)
);

// Teamleden, documenten, planning, etc. kun je op dezelfde manier toevoegen met controller-methodes

export default router;
