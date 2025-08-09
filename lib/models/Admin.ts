import clientPromise from '../mongodb';

export interface AdminData {
  _id?: string;
  username: string;
  password: string;
  name: string;
  email: string;
  phone?: string;
  department?: string;
  position?: string;
  permissions?: string[];
  lastLogin?: Date;
  isSuper?: boolean;
  role: 'admin';
  createdAt?: Date;
  updatedAt?: Date;
}

export class AdminService {
  private static async getCollection() {
    const client = await clientPromise;
    const db = client.db('bracu_out');
    return db.collection('admins');
  }

  static async findByUsername(username: string): Promise<AdminData | null> {
    const collection = await this.getCollection();
    return await collection.findOne({ username }) as AdminData | null;
  }

  static async findByEmail(email: string): Promise<AdminData | null> {
    const collection = await this.getCollection();
    return await collection.findOne({ email }) as AdminData | null;
  }

  static async createAdmin(adminData: Omit<AdminData, '_id' | 'createdAt' | 'updatedAt'>): Promise<AdminData> {
    const collection = await this.getCollection();
    
    // Check if admin already exists
    const existingAdmin = await this.findByUsername(adminData.username);
    if (existingAdmin) {
      throw new Error('Admin with this username already exists');
    }

    const existingEmail = await this.findByEmail(adminData.email);
    if (existingEmail) {
      throw new Error('Admin with this email already exists');
    }
    
    const newAdmin = {
      ...adminData,
      password: adminData.password, // Store plain text password
      role: 'admin' as const,
      permissions: adminData.permissions || ['read', 'write', 'delete'],
      isSuper: adminData.isSuper || false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await collection.insertOne(newAdmin);
    return { ...newAdmin, _id: result.insertedId.toString() };
  }

  static async validatePassword(plainPassword: string, storedPassword: string): Promise<boolean> {
    return plainPassword === storedPassword; // Direct plain text comparison
  }

  static async getAllAdmins(): Promise<AdminData[]> {
    const collection = await this.getCollection();
    const admins = await collection.find({}).toArray();
    return admins.map(admin => ({
      ...admin,
      _id: admin._id.toString()
    })) as AdminData[];
  }

  static async updateAdmin(username: string, updateData: Partial<AdminData>): Promise<boolean> {
    const collection = await this.getCollection();
    
    if (updateData.password) {
      updateData.password = updateData.password; // Store plain text password
    }
    
    updateData.updatedAt = new Date();
    
    const result = await collection.updateOne(
      { username },
      { $set: updateData }
    );
    
    return result.modifiedCount > 0;
  }

  static async updateLastLogin(username: string): Promise<boolean> {
    const collection = await this.getCollection();
    
    const result = await collection.updateOne(
      { username },
      { 
        $set: { 
          lastLogin: new Date(),
          updatedAt: new Date()
        }
      }
    );
    
    return result.modifiedCount > 0;
  }

  static async deleteAdmin(username: string): Promise<boolean> {
    const collection = await this.getCollection();
    const result = await collection.deleteOne({ username });
    return result.deletedCount > 0;
  }

  static async getSuperAdmins(): Promise<AdminData[]> {
    const collection = await this.getCollection();
    const superAdmins = await collection.find({ isSuper: true }).toArray();
    return superAdmins.map(admin => ({
      ...admin,
      _id: admin._id.toString()
    })) as AdminData[];
  }

  static async hasPermission(username: string, permission: string): Promise<boolean> {
    const admin = await this.findByUsername(username);
    if (!admin) return false;
    
    return admin.isSuper || (admin.permissions && admin.permissions.includes(permission));
  }

  static async getSystemStats(): Promise<{
    totalUsers: number;
    totalStudents: number;
    totalAlumni: number;
    totalRecruiters: number;
    totalAdmins: number;
    recentActivities: any[];
  }> {
    const client = await clientPromise;
    const db = client.db('bracu_out');
    
    const [students, alumni, recruiters, admins] = await Promise.all([
      db.collection('students').countDocuments(),
      db.collection('alumni').countDocuments(),
      db.collection('recruiters').countDocuments(),
      db.collection('admins').countDocuments()
    ]);
    
    // Get recent activities (simplified example)
    const recentActivities = [];
    
    return {
      totalUsers: students + alumni + recruiters + admins,
      totalStudents: students,
      totalAlumni: alumni,
      totalRecruiters: recruiters,
      totalAdmins: admins,
      recentActivities
    };
  }
}
