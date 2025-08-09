import type { NextApiRequest, NextApiResponse } from 'next';
import { StudentService } from '../../../lib/models/Student';
import { authenticateEmailRequest } from '../../../lib/auth/bearerAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      username,
      name,
      email,
      password,
      studentId,
      major,
      year,
      university,
      phone,
      gpa,
      requireBearerAuth = false // Optional: require Bearer token for email operations
    } = req.body;

    // Validate required fields
    if (!username || !name || !email || !password || !studentId || !major || !year || !university) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    // If Bearer token authentication is required for email operations
    if (requireBearerAuth) {
      const authenticatedUser = await authenticateEmailRequest(req);
      
      if (!authenticatedUser) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Valid Bearer token required for email-related registration'
        });
      }

      // Only admin can register users with email when Bearer auth is required
      if (authenticatedUser.role !== 'admin') {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'Admin access required for email-verified registration'
        });
      }
    }

    // Create the student
    const newStudent = await StudentService.createStudent({
      username,
      name,
      email,
      password,
      studentId,
      major,
      year,
      university,
      phone,
      gpa: gpa ? parseFloat(gpa) : undefined,
      role: 'student'
    });

    // Remove password from response
    const { password: _, ...studentResponse } = newStudent;

    res.status(201).json({
      message: 'Student registration successful',
      student: studentResponse
    });

  } catch (error: any) {
    console.error('Student registration error:', error);
    
    if (error.message.includes('already exists')) {
      return res.status(409).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
}
