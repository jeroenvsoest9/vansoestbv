import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/database';
import { AuthRequest, authenticate, checkRole } from '../middleware/auth';

const router = Router();

// Get all settings
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const settingsDoc = await getDoc(doc(db, 'settings', 'global'));
    if (!settingsDoc.exists()) {
      return res.status(404).json({ error: 'Settings not found' });
    }
    res.json(settingsDoc.data());
  } catch (error: any) {
    console.error('Get settings error:', error);
    res.status(500).json({
      error: 'Failed to get settings',
      message: error.message
    });
  }
});

// Update settings (admin only)
router.put('/', [authenticate, checkRole(['admin'])], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const settingsRef = doc(db, 'settings', 'global');
    const settingsDoc = await getDoc(settingsRef);

    if (!settingsDoc.exists()) {
      // Create new settings document
      await setDoc(settingsRef, {
        ...req.body,
        updatedAt: new Date().toISOString(),
        updatedBy: req.user?.uid
      });
    } else {
      // Update existing settings
      await updateDoc(settingsRef, {
        ...req.body,
        updatedAt: new Date().toISOString(),
        updatedBy: req.user?.uid
      });
    }

    const updatedSettings = await getDoc(settingsRef);
    res.json(updatedSettings.data());
  } catch (error: any) {
    console.error('Update settings error:', error);
    res.status(500).json({
      error: 'Failed to update settings',
      message: error.message
    });
  }
});

// Get specific setting
router.get('/:key', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const settingsDoc = await getDoc(doc(db, 'settings', 'global'));
    if (!settingsDoc.exists()) {
      return res.status(404).json({ error: 'Settings not found' });
    }

    const settings = settingsDoc.data();
    const value = settings[req.params.key];

    if (value === undefined) {
      return res.status(404).json({ error: 'Setting not found' });
    }

    res.json({ key: req.params.key, value });
  } catch (error: any) {
    console.error('Get setting error:', error);
    res.status(500).json({
      error: 'Failed to get setting',
      message: error.message
    });
  }
});

// Update specific setting (admin only)
router.put('/:key', [authenticate, checkRole(['admin'])], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const settingsRef = doc(db, 'settings', 'global');
    const settingsDoc = await getDoc(settingsRef);

    if (!settingsDoc.exists()) {
      return res.status(404).json({ error: 'Settings not found' });
    }

    await updateDoc(settingsRef, {
      [req.params.key]: req.body.value,
      updatedAt: new Date().toISOString(),
      updatedBy: req.user?.uid
    });

    const updatedSettings = await getDoc(settingsRef);
    res.json({ key: req.params.key, value: updatedSettings.data()?.[req.params.key] });
  } catch (error: any) {
    console.error('Update setting error:', error);
    res.status(500).json({
      error: 'Failed to update setting',
      message: error.message
    });
  }
});

export default router; 