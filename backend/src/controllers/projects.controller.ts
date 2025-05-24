import { Request, Response, NextFunction } from 'express';
import { ProjectModel } from '../models/Project';

const projectModel = new ProjectModel();

export class ProjectsController {
  // 1. Start offerte-aanvraag, retourneer dynamische vragenlijst
  async request(req: Request, res: Response, next: NextFunction) {
    try {
      const { /* client, type */ } = req.body;
      // Dynamische vragen genereren (stub)
      const questions = [
        { id: 'bouwtype', label: 'Wat voor project?', options: ['aanbouw', 'opbouw', 'dakkapel'] },
        { id: 'oppervlakte', label: 'Wat is de gewenste oppervlakte?', options: ['<20m2', '20-40m2', '>40m2'] }
      ];
      res.json({ success: true, questions });
    } catch (error) {
      next(error);
    }
  }

  // 2. Klant stuurt antwoorden in, projectmap + documenten genereren
  async submit(req: Request, res: Response, next: NextFunction) {
    try {
      const { client, type, answers } = req.body;
      const project = await projectModel.create({
        client,
        type,
        status: 'aanvraag',
        answers,
        documents: {},
      });
      res.status(201).json({ success: true, project });
    } catch (error) {
      next(error);
    }
  }

  // 3. Project ophalen
  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const project = await projectModel.findById(id);
      if (!project) return res.status(404).json({ success: false, error: 'Niet gevonden' });
      res.json({ success: true, project });
    } catch (error) {
      next(error);
    }
  }

  // 4. Urenregistratie (stub)
  async addTimesheet(req: Request, res: Response, next: NextFunction) {
    try {
      // TODO: Voeg GPS/urenlogica toe
      res.json({ success: true, message: 'Uren geregistreerd (stub)' });
    } catch (error) {
      next(error);
    }
  }

  // 5. Materialen toevoegen (stub)
  async addMaterials(req: Request, res: Response, next: NextFunction) {
    try {
      res.json({ success: true, message: 'Materialen toegevoegd (stub)' });
    } catch (error) {
      next(error);
    }
  }

  // 6. Foto uploaden (stub)
  async addPhoto(req: Request, res: Response, next: NextFunction) {
    try {
      res.json({ success: true, message: 'Foto geüpload (stub)' });
    } catch (error) {
      next(error);
    }
  }

  // 7. Afspraak toevoegen (stub)
  async addAppointment(req: Request, res: Response, next: NextFunction) {
    try {
      res.json({ success: true, message: 'Afspraak toegevoegd (stub)' });
    } catch (error) {
      next(error);
    }
  }

  // 8. Nacalculatie ophalen (stub)
  async getFinalCalculation(req: Request, res: Response, next: NextFunction) {
    try {
      res.json({ success: true, calculation: 'Nacalculatie (stub)' });
    } catch (error) {
      next(error);
    }
  }
}
