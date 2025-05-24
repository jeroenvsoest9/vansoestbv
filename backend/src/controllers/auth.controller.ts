import { Request, Response } from 'express';
import { adminAuth } from '../config/firebase';
import { UserModel } from '../models/User';
import logger from '../config/logger';

export class AuthController {
  private userModel: UserModel;

  constructor() {
    this.userModel = new UserModel();
  }

  async register(req: Request, res: Response) {
    try {
      const { email, password, username, firstName, lastName } = req.body;

      // Create user in Firebase Auth
      const userRecord = await adminAuth.createUser({
        email,
        password,
        displayName: `${firstName} ${lastName}`,
        emailVerified: false,
      });

      // Create user in Firestore
      const user = await this.userModel.create({
        uid: userRecord.uid,
        email,
        username,
        firstName,
        lastName,
        role: 'user',
        status: 'active',
      });

      res.status(201).json({
        success: true,
        data: {
          user: {
            id: user.uid,
            email: user.email,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            status: user.status,
          },
        },
      });
    } catch (error: any) {
      logger.error('Error in register:', error);
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { idToken } = req.body;

      // Verify the ID token
      const decodedToken = await adminAuth.verifyIdToken(idToken);
      const user = await this.userModel.findById(decodedToken.uid);

      if (!user) {
        throw new Error('User not found');
      }

      // Update last login
      await this.userModel.updateLastLogin(user.uid);

      // Create session token
      const sessionToken = await adminAuth.createSessionCookie(idToken, {
        expiresIn: 60 * 60 * 24 * 5 * 1000, // 5 days
      });

      res.status(200).json({
        success: true,
        data: {
          user: {
            id: user.uid,
            email: user.email,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            status: user.status,
          },
          sessionToken,
        },
      });
    } catch (error: any) {
      logger.error('Error in login:', error);
      res.status(401).json({
        success: false,
        error: error.message,
      });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      const { sessionToken } = req.body;

      // Verify the session cookie
      const decodedClaims = await adminAuth.verifySessionCookie(sessionToken);

      // Revoke the session cookie
      await adminAuth.revokeRefreshTokens(decodedClaims.sub);

      res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error: any) {
      logger.error('Error in logout:', error);
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async verifySession(req: Request, res: Response) {
    try {
      const { sessionToken } = req.body;

      // Verify the session cookie
      const decodedClaims = await adminAuth.verifySessionCookie(sessionToken);
      const user = await this.userModel.findById(decodedClaims.uid);

      if (!user) {
        throw new Error('User not found');
      }

      res.status(200).json({
        success: true,
        data: {
          user: {
            id: user.uid,
            email: user.email,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            status: user.status,
          },
        },
      });
    } catch (error: any) {
      logger.error('Error in verifySession:', error);
      res.status(401).json({
        success: false,
        error: error.message,
      });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;

      // Send password reset email
      await adminAuth.generatePasswordResetLink(email);

      res.status(200).json({
        success: true,
        message: 'Password reset email sent',
      });
    } catch (error: any) {
      logger.error('Error in resetPassword:', error);
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async updatePassword(req: Request, res: Response) {
    try {
      const { uid, newPassword } = req.body;

      // Update password
      await adminAuth.updateUser(uid, {
        password: newPassword,
      });

      res.status(200).json({
        success: true,
        message: 'Password updated successfully',
      });
    } catch (error: any) {
      logger.error('Error in updatePassword:', error);
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
}
