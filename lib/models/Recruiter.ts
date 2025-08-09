import clientPromise from '../mongodb';

export interface RecruiterData {
  _id?: string;
  username: string;
  password: string;
  name: string;
  email: string;
  company: string;
  position: string;
  phone?: string;
  website?: string;
  industry?: string;
  companySize?: '1-10' | '11-50' | '51-200' | '201-1000' | '1000+';
  activeJobPosts?: number;
  totalApplications?: number;
  interviewsScheduled?: number;
  successfulHires?: number;
  role: 'recruiter';
  createdAt?: Date;
  updatedAt?: Date;
}

export class RecruiterService {
  private static async getCollection() {
    const client = await clientPromise;
    const db = client.db('bracu_out');
    return db.collection('recruiters');
  }

  static async findByUsername(username: string): Promise<RecruiterData | null> {
    const collection = await this.getCollection();
    return await collection.findOne({ username }) as RecruiterData | null;
  }

  static async findByEmail(email: string): Promise<RecruiterData | null> {
    const collection = await this.getCollection();
    return await collection.findOne({ email }) as RecruiterData | null;
  }

  static async findByCompany(company: string): Promise<RecruiterData[]> {
    const collection = await this.getCollection();
    const recruiters = await collection.find({ company }).toArray();
    return recruiters.map(recruiter => ({
      ...recruiter,
      _id: recruiter._id.toString()
    })) as RecruiterData[];
  }

  static async createRecruiter(recruiterData: Omit<RecruiterData, '_id' | 'createdAt' | 'updatedAt'>): Promise<RecruiterData> {
    const collection = await this.getCollection();
    
    // Check if recruiter already exists
    const existingRecruiter = await this.findByUsername(recruiterData.username);
    if (existingRecruiter) {
      throw new Error('Recruiter with this username already exists');
    }

    const existingEmail = await this.findByEmail(recruiterData.email);
    if (existingEmail) {
      throw new Error('Recruiter with this email already exists');
    }
    
    const newRecruiter = {
      ...recruiterData,
      password: recruiterData.password, // Store plain text password
      role: 'recruiter' as const,
      activeJobPosts: recruiterData.activeJobPosts || 0,
      totalApplications: recruiterData.totalApplications || 0,
      interviewsScheduled: recruiterData.interviewsScheduled || 0,
      successfulHires: recruiterData.successfulHires || 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await collection.insertOne(newRecruiter);
    return { ...newRecruiter, _id: result.insertedId.toString() };
  }

  static async validatePassword(plainPassword: string, storedPassword: string): Promise<boolean> {
    return plainPassword === storedPassword; // Direct plain text comparison
  }

  static async getAllRecruiters(): Promise<RecruiterData[]> {
    const collection = await this.getCollection();
    const recruiters = await collection.find({}).toArray();
    return recruiters.map(recruiter => ({
      ...recruiter,
      _id: recruiter._id.toString()
    })) as RecruiterData[];
  }

  static async updateRecruiter(username: string, updateData: Partial<RecruiterData>): Promise<boolean> {
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

  static async deleteRecruiter(username: string): Promise<boolean> {
    const collection = await this.getCollection();
    const result = await collection.deleteOne({ username });
    return result.deletedCount > 0;
  }

  static async updateRecruitmentStats(username: string, stats: {
    activeJobPosts?: number;
    totalApplications?: number;
    interviewsScheduled?: number;
    successfulHires?: number;
  }): Promise<boolean> {
    const collection = await this.getCollection();
    
    const result = await collection.updateOne(
      { username },
      { 
        $set: {
          ...stats,
          updatedAt: new Date()
        }
      }
    );
    
    return result.modifiedCount > 0;
  }

  static async getRecruitersStats(): Promise<{
    totalRecruiters: number;
    totalJobPosts: number;
    totalApplications: number;
    totalHires: number;
  }> {
    const collection = await this.getCollection();
    const recruiters = await collection.find({}).toArray();
    
    return {
      totalRecruiters: recruiters.length,
      totalJobPosts: recruiters.reduce((sum, r) => sum + (r.activeJobPosts || 0), 0),
      totalApplications: recruiters.reduce((sum, r) => sum + (r.totalApplications || 0), 0),
      totalHires: recruiters.reduce((sum, r) => sum + (r.successfulHires || 0), 0)
    };
  }
}
