import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { UserService } from '../../../lib/models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(req, res, authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method === 'GET') {
      // Get all users
      const users = await UserService.getAllUsers();
      
      // Remove passwords from response
      const safeUsers = users.map(user => ({
        _id: user._id,
        username: user.username,
        name: user.name,
        role: user.role,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }));
      
      return res.status(200).json(safeUsers);
    }

    if (req.method === 'POST') {
      // Create new user
      const { username, password, name, role, email } = req.body;
      
      if (!username || !password || !name || !role) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Check if user already exists
      const existingUser = await UserService.findByUsername(username);
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      const newUser = await UserService.createUser({
        username,
        password,
        name,
        role,
        email
      });

      // Remove password from response
      const { password: _, ...safeUser } = newUser;
      return res.status(201).json(safeUser);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
