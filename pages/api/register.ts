import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

const uri = process.env.MONGODB_URI;
const dbName = 'bracu_out';

interface RegisterRequestBody {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'alumni' | 'recruiter';
  studentId?: string;
  graduationYear?: string;
  company?: string;
  position?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  try {
    const {
      name,
      email,
      password,
      role,
      studentId,
      graduationYear,
      company,
      position
    }: RegisterRequestBody = req.body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: 'Missing required fields: name, email, password, and role are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Validate role-specific fields
    if (role === 'student' && !studentId) {
      return res.status(400).json({ message: 'Student ID is required for student registration' });
    }

    if (role === 'alumni' && !graduationYear) {
      return res.status(400).json({ message: 'Graduation year is required for alumni registration' });
    }

    if (role === 'recruiter' && (!company || !position)) {
      return res.status(400).json({ message: 'Company and position are required for recruiter registration' });
    }

    if (!uri) {
      return res.status(500).json({ message: 'Database connection string not configured' });
    }

    // Connect to MongoDB
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);
    const usersCollection = db.collection('users');

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      await client.close();
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Prepare user data based on role
    const baseUserData = {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    };

    let userData = { ...baseUserData };

    // Add role-specific data
    switch (role) {
      case 'student':
        userData = {
          ...userData,
          studentId,
          enrollmentStatus: 'active',
        };
        break;
      
      case 'alumni':
        userData = {
          ...userData,
          graduationYear: parseInt(graduationYear!),
          alumniStatus: 'verified',
        };
        break;
      
      case 'recruiter':
        userData = {
          ...userData,
          company,
          position,
          recruiterStatus: 'pending', // Can be approved by admin later
        };
        break;
    }

    // Insert user into database
    const result = await usersCollection.insertOne(userData);
    
    await client.close();

    // Log successful registration
    console.log(`✅ New ${role} registered:`, {
      id: result.insertedId,
      name,
      email: email.toLowerCase(),
      role,
      timestamp: new Date().toISOString()
    });

    // Return success response (don't send password back)
    const { password: _, ...userResponse } = userData;
    
    return res.status(201).json({
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully`,
      user: {
        id: result.insertedId,
        ...userResponse
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    return res.status(500).json({
      message: 'Internal server error during registration',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
}
