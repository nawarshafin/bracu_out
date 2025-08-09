import { NextApiRequest, NextApiResponse } from 'next';
import { authenticateEmailRequest } from '../../../../lib/auth/bearerAuth';
import { UserService } from '../../../../lib/models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Authenticate using Bearer token
    const authenticatedUser = await authenticateEmailRequest(req);
    
    if (!authenticatedUser) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Valid Bearer token required for email operations'
      });
    }

    // Check if user is admin
    if (authenticatedUser.role !== 'admin') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Admin access required to list all emails'
      });
    }

    // Get all users
    const users = await UserService.getAllUsers();
    
    // Filter and format email information
    const emailList = users
      .filter(user => user.email) // Only include users with email addresses
      .map(user => ({
        email: user.email,
        username: user.username,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }));

    // Group by role for better organization
    const emailsByRole = {
      admin: emailList.filter(user => user.role === 'admin'),
      alumni: emailList.filter(user => user.role === 'alumni'),
      recruiter: emailList.filter(user => user.role === 'recruiter'),
      student: emailList.filter(user => user.role === 'student')
    };

    const stats = {
      total: emailList.length,
      byRole: {
        admin: emailsByRole.admin.length,
        alumni: emailsByRole.alumni.length,
        recruiter: emailsByRole.recruiter.length,
        student: emailsByRole.student.length
      }
    };

    return res.status(200).json({
      message: 'Email list retrieved successfully',
      stats,
      emails: emailsByRole,
      allEmails: emailList, // Flat list for easy processing
      retrievedBy: {
        username: authenticatedUser.username,
        role: authenticatedUser.role
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Email list API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while retrieving email list'
    });
  }
}
