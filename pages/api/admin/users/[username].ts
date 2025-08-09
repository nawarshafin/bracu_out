import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';
import { UserService } from '../../../../lib/models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(req, res, authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { username } = req.query;

    if (typeof username !== 'string') {
      return res.status(400).json({ error: 'Invalid username' });
    }

    if (req.method === 'GET') {
      // Get specific user
      const user = await UserService.findByUsername(username);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Remove password from response
      const { password: _, ...safeUser } = user;
      return res.status(200).json(safeUser);
    }

    if (req.method === 'PUT') {
      // Update user
      const updateData = req.body;
      
      // Remove sensitive fields that shouldn't be updated directly
      delete updateData._id;
      delete updateData.createdAt;
      delete updateData.updatedAt;

      const updated = await UserService.updateUser(username, updateData);
      
      if (!updated) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json({ message: 'User updated successfully' });
    }

    if (req.method === 'DELETE') {
      // Delete user
      const deleted = await UserService.deleteUser(username);
      
      if (!deleted) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json({ message: 'User deleted successfully' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
