import jwt from 'jsonwebtoken';
import { NextApiRequest } from 'next';
import { UserService } from '../models/User';

export interface TokenPayload {
  userId: string;
  username: string;
  email: string;
  role: 'admin' | 'alumni' | 'recruiter' | 'student' | 'graduate';
  iat?: number;
  exp?: number;
}

export interface AuthenticatedUser {
  userId: string;
  username: string;
  email: string;
  role: 'admin' | 'alumni' | 'recruiter' | 'student' | 'graduate';
}

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

/**
 * Generate a Bearer token for a user
 */
export function generateBearerToken(user: AuthenticatedUser): string {
  const payload: TokenPayload = {
    userId: user.userId,
    username: user.username,
    email: user.email,
    role: user.role
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '24h', // Token expires in 24 hours
    issuer: 'bracu-out-system'
  });
}

/**
 * Verify and decode a Bearer token
 */
export function verifyBearerToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

/**
 * Extract Bearer token from Authorization header
 */
export function extractBearerToken(req: NextApiRequest): string | null {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return null;
  }

  // Check if it starts with "Bearer "
  if (!authHeader.startsWith('Bearer ')) {
    return null;
  }

  // Extract token after "Bearer "
  return authHeader.substring(7);
}

/**
 * Authenticate request using Bearer token for email-related operations
 */
export async function authenticateEmailRequest(req: NextApiRequest): Promise<AuthenticatedUser | null> {
  try {
    // Extract token from Authorization header
    const token = extractBearerToken(req);
    
    if (!token) {
      return null;
    }

    // Verify token
    const payload = verifyBearerToken(token);
    
    if (!payload) {
      return null;
    }

    // Verify user still exists in database
    const user = await UserService.findByUsername(payload.username);
    
    if (!user) {
      return null;
    }

    // Verify email matches
    if (user.email !== payload.email) {
      return null;
    }

    return {
      userId: payload.userId,
      username: payload.username,
      email: payload.email,
      role: payload.role
    };
  } catch (error) {
    console.error('Bearer token authentication failed:', error);
    return null;
  }
}

/**
 * Middleware to verify Bearer token authentication for email operations
 */
export function requireBearerAuth() {
  return async (req: NextApiRequest, res: any, next: any) => {
    const user = await authenticateEmailRequest(req);
    
    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Valid Bearer token required for email operations'
      });
    }

    // Add user to request object
    (req as any).authenticatedUser = user;
    next();
  };
}

/**
 * Check if user has permission for email operations (admin or own email)
 */
export function hasEmailPermission(authenticatedUser: AuthenticatedUser, targetEmail: string): boolean {
  // Admin can access any email
  if (authenticatedUser.role === 'admin') {
    return true;
  }

  // User can access their own email
  return authenticatedUser.email === targetEmail;
}

export default {
  generateBearerToken,
  verifyBearerToken,
  extractBearerToken,
  authenticateEmailRequest,
  requireBearerAuth,
  hasEmailPermission
};
