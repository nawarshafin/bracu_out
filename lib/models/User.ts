import clientPromise from '../mongodb';
import bcrypt from 'bcryptjs';

export interface DatabaseUser {
  _id?: string;
  userName?: string;  // Optional for existing users
  password: string;
  name: string;
  role: 'admin' | 'alumni' | 'recruiter' | 'student' | 'graduate';
  email: string;  // Required field
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class UserService {
  private static async getCollection() {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || 'BRACU_Out');
    return db.collection('Users'); // Capital U to match your existing collection
  }

  static async findByUsername(userName: string): Promise<DatabaseUser | null> {
    const collection = await this.getCollection();
    // Try to find by userName field or username field (case variations)
    return await collection.findOne({ 
      $or: [
        { userName: userName },
        { username: userName }, // lowercase variation
        { userName: userName.toLowerCase() },
        { username: userName.toLowerCase() }
      ]
    }) as DatabaseUser | null;
  }

  static async findByEmail(email: string): Promise<DatabaseUser | null> {
    const collection = await this.getCollection();
    return await collection.findOne({ email: email.toLowerCase() }) as DatabaseUser | null;
  }

  static async findByEmailOrUsername(emailOrUsername: string): Promise<DatabaseUser | null> {
    const collection = await this.getCollection();
    return await collection.findOne({ 
      $or: [
        { email: emailOrUsername.toLowerCase() }, 
        { userName: emailOrUsername.toLowerCase() }
      ]
    }) as DatabaseUser | null;
  }

  static async createUser(userData: Omit<DatabaseUser, '_id' | 'createdAt' | 'updatedAt'>): Promise<DatabaseUser> {
    const collection = await this.getCollection();
    
    const newUser = {
      ...userData,
      password: userData.password, // Store plain text password
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await collection.insertOne(newUser);
    return { ...newUser, _id: result.insertedId.toString() };
  }

  static async validatePassword(plainPassword: string, storedPassword: string): Promise<boolean> {
    try {
      // Check if password is bcrypt hashed (starts with $2b$, $2a$, or $2y$)
      if (storedPassword.startsWith('$2b$') || storedPassword.startsWith('$2a$') || storedPassword.startsWith('$2y$')) {
        // Use bcrypt to compare
        return await bcrypt.compare(plainPassword, storedPassword);
      } else {
        // Plain text comparison for backward compatibility
        return plainPassword === storedPassword;
      }
    } catch (error) {
      console.error('Password validation error:', error);
      return false;
    }
  }

  static async getAllUsers(): Promise<DatabaseUser[]> {
    const collection = await this.getCollection();
    const users = await collection.find({}).toArray();
    return users.map(user => ({
      ...user,
      _id: user._id.toString()
    })) as DatabaseUser[];
  }

  static async getUsersByRole(role: string): Promise<DatabaseUser[]> {
    const collection = await this.getCollection();
    const users = await collection.find({ role }).toArray();
    return users.map(user => ({
      ...user,
      _id: user._id.toString()
    })) as DatabaseUser[];
  }

  static async updateUser(email: string, updateData: Partial<DatabaseUser>): Promise<boolean> {
    const collection = await this.getCollection();
    
    if (updateData.password) {
      updateData.password = updateData.password; // Store plain text password
    }
    
    updateData.updatedAt = new Date();
    
    const result = await collection.updateOne(
      { email: email.toLowerCase() },
      { $set: updateData }
    );
    
    return result.modifiedCount > 0;
  }

  static async deleteUser(email: string): Promise<boolean> {
    const collection = await this.getCollection();
    const result = await collection.deleteOne({ email: email.toLowerCase() });
    return result.deletedCount > 0;
  }
}
