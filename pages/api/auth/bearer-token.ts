import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './[...nextauth]';
import { generateBearerToken } from '../../../lib/auth/bearerAuth';
import { UserService } from '../../../lib/models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the authenticated session
    const session = await getServerSession(req, res, authOptions);
    
    if (!session || !session.user) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'You must be logged in to generate a Bearer token' 
      });
    }

    // Get full user details from database
    let user = null;
    
    // Try to find by username first, then by email
    if (session.user.userName) {
      user = await UserService.findByUsername(session.user.userName);
    }
    
    if (!user && session.user.email) {
      user = await UserService.findByEmail(session.user.email);
    }
    
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found',
        message: 'User details not found in database' 
      });
    }

    if (!user.email) {
      return res.status(400).json({ 
        error: 'Email required',
        message: 'User must have an email address to generate Bearer token' 
      });
    }

    // Generate Bearer token
    const token = generateBearerToken({
      userId: user._id?.toString() || user.email,
      username: user.userName || user.email.split('@')[0],
      email: user.email,
      role: user.role
    });

    res.status(200).json({
      message: 'Bearer token generated successfully',
      token: token,
      user: {
        id: user._id?.toString(),
        name: user.name,
        username: user.userName || user.email.split('@')[0],
        email: user.email,
        role: user.role
      },
      expiresIn: '24h'
    });

  } catch (error) {
    console.error('Bearer token generation error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to generate Bearer token' 
    });
  }
}
