import { NextApiRequest, NextApiResponse } from 'next';
import { authenticateEmailRequest, hasEmailPermission } from '../../../../lib/auth/bearerAuth';
import { UserService } from '../../../../lib/models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Authenticate using Bearer token
    const authenticatedUser = await authenticateEmailRequest(req);
    
    if (!authenticatedUser) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Valid Bearer token required for email operations'
      });
    }

    if (req.method === 'GET') {
      // Get email profile information
      const { email } = req.query;
      
      if (typeof email !== 'string') {
        return res.status(400).json({ error: 'Email parameter is required' });
      }

      // Check permissions - admin can access any email, user can access only their own
      if (!hasEmailPermission(authenticatedUser, email)) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'You do not have permission to access this email'
        });
      }

      // Find user by email
      const user = await UserService.findByEmail(email);
      
      if (!user) {
        return res.status(404).json({
          error: 'User not found',
          message: 'No user found with this email address'
        });
      }

      // Return email profile (excluding sensitive information)
      const emailProfile = {
        email: user.email,
        username: user.username,
        name: user.name,
        role: user.role,
        emailVerified: true, // You can add email verification logic here
        lastLogin: user.updatedAt,
        createdAt: user.createdAt
      };

      return res.status(200).json({
        message: 'Email profile retrieved successfully',
        profile: emailProfile,
        requestedBy: {
          username: authenticatedUser.username,
          role: authenticatedUser.role
        }
      });
    }

    if (req.method === 'PUT') {
      // Update email address
      const { currentEmail, newEmail } = req.body;
      
      if (!currentEmail || !newEmail) {
        return res.status(400).json({
          error: 'Missing required fields',
          message: 'Both currentEmail and newEmail are required'
        });
      }

      // Check permissions for current email
      if (!hasEmailPermission(authenticatedUser, currentEmail)) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'You do not have permission to modify this email'
        });
      }

      // Check if new email already exists
      const existingUser = await UserService.findByEmail(newEmail);
      if (existingUser && existingUser.email !== currentEmail) {
        return res.status(409).json({
          error: 'Email already exists',
          message: 'The new email address is already in use'
        });
      }

      // Find user by current email
      const user = await UserService.findByEmail(currentEmail);
      if (!user) {
        return res.status(404).json({
          error: 'User not found',
          message: 'No user found with the current email address'
        });
      }

      // Update email
      const updated = await UserService.updateUser(user.username, { email: newEmail });
      
      if (!updated) {
        return res.status(500).json({
          error: 'Update failed',
          message: 'Failed to update email address'
        });
      }

      return res.status(200).json({
        message: 'Email updated successfully',
        oldEmail: currentEmail,
        newEmail: newEmail,
        updatedBy: {
          username: authenticatedUser.username,
          role: authenticatedUser.role
        }
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Email API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while processing the email operation'
    });
  }
}
