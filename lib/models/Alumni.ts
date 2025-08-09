import clientPromise from '../mongodb';

export interface AlumniData {
  _id?: string;
  username: string;
  password: string;
  name: string;
  email: string;
  studentId: string;
  graduationYear: number;
  degree: string;
  major: string;
  university: string;
  currentCompany?: string;
  currentPosition?: string;
  industry?: string;
  phone?: string;
  linkedIn?: string;
  mentoring?: boolean;
  yearsOfExperience?: number;
  skills?: string[];
  achievements?: string[];
  role: 'alumni';
  createdAt?: Date;
  updatedAt?: Date;
}

export class AlumniService {
  private static async getCollection() {
    const client = await clientPromise;
    const db = client.db('bracu_out');
    return db.collection('alumni');
  }

  static async findByUsername(username: string): Promise<AlumniData | null> {
    const collection = await this.getCollection();
    return await collection.findOne({ username }) as AlumniData | null;
  }

  static async findByEmail(email: string): Promise<AlumniData | null> {
    const collection = await this.getCollection();
    return await collection.findOne({ email }) as AlumniData | null;
  }

  static async findByStudentId(studentId: string): Promise<AlumniData | null> {
    const collection = await this.getCollection();
    return await collection.findOne({ studentId }) as AlumniData | null;
  }

  static async findByGraduationYear(year: number): Promise<AlumniData[]> {
    const collection = await this.getCollection();
    const alumni = await collection.find({ graduationYear: year }).toArray();
    return alumni.map(alumnus => ({
      ...alumnus,
      _id: alumnus._id.toString()
    })) as AlumniData[];
  }

  static async findMentors(): Promise<AlumniData[]> {
    const collection = await this.getCollection();
    const mentors = await collection.find({ mentoring: true }).toArray();
    return mentors.map(mentor => ({
      ...mentor,
      _id: mentor._id.toString()
    })) as AlumniData[];
  }

  static async createAlumni(alumniData: Omit<AlumniData, '_id' | 'createdAt' | 'updatedAt'>): Promise<AlumniData> {
    const collection = await this.getCollection();
    
    // Check if alumni already exists
    const existingAlumni = await this.findByUsername(alumniData.username);
    if (existingAlumni) {
      throw new Error('Alumni with this username already exists');
    }

    const existingEmail = await this.findByEmail(alumniData.email);
    if (existingEmail) {
      throw new Error('Alumni with this email already exists');
    }

    const existingStudentId = await this.findByStudentId(alumniData.studentId);
    if (existingStudentId) {
      throw new Error('Alumni with this student ID already exists');
    }
    
    const newAlumni = {
      ...alumniData,
      password: alumniData.password, // Store plain text password
      role: 'alumni' as const,
      mentoring: alumniData.mentoring || false,
      yearsOfExperience: alumniData.yearsOfExperience || 0,
      skills: alumniData.skills || [],
      achievements: alumniData.achievements || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await collection.insertOne(newAlumni);
    return { ...newAlumni, _id: result.insertedId.toString() };
  }

  static async validatePassword(plainPassword: string, storedPassword: string): Promise<boolean> {
    return plainPassword === storedPassword; // Direct plain text comparison
  }

  static async getAllAlumni(): Promise<AlumniData[]> {
    const collection = await this.getCollection();
    const alumni = await collection.find({}).toArray();
    return alumni.map(alumnus => ({
      ...alumnus,
      _id: alumnus._id.toString()
    })) as AlumniData[];
  }

  static async updateAlumni(username: string, updateData: Partial<AlumniData>): Promise<boolean> {
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

  static async deleteAlumni(username: string): Promise<boolean> {
    const collection = await this.getCollection();
    const result = await collection.deleteOne({ username });
    return result.deletedCount > 0;
  }

  static async getAlumniStats(): Promise<{
    totalAlumni: number;
    mentorCount: number;
    graduationYearStats: { [year: number]: number };
    industryStats: { [industry: string]: number };
  }> {
    const collection = await this.getCollection();
    const alumni = await collection.find({}).toArray();
    
    const graduationYearStats: { [year: number]: number } = {};
    const industryStats: { [industry: string]: number } = {};
    
    alumni.forEach(alumnus => {
      // Count graduation years
      if (alumnus.graduationYear) {
        graduationYearStats[alumnus.graduationYear] = (graduationYearStats[alumnus.graduationYear] || 0) + 1;
      }
      
      // Count industries
      if (alumnus.industry) {
        industryStats[alumnus.industry] = (industryStats[alumnus.industry] || 0) + 1;
      }
    });
    
    return {
      totalAlumni: alumni.length,
      mentorCount: alumni.filter(a => a.mentoring).length,
      graduationYearStats,
      industryStats
    };
  }

  static async searchAlumni(criteria: {
    industry?: string;
    company?: string;
    graduationYear?: number;
    mentoring?: boolean;
    skills?: string[];
  }): Promise<AlumniData[]> {
    const collection = await this.getCollection();
    const query: any = {};
    
    if (criteria.industry) query.industry = new RegExp(criteria.industry, 'i');
    if (criteria.company) query.currentCompany = new RegExp(criteria.company, 'i');
    if (criteria.graduationYear) query.graduationYear = criteria.graduationYear;
    if (criteria.mentoring !== undefined) query.mentoring = criteria.mentoring;
    if (criteria.skills && criteria.skills.length > 0) {
      query.skills = { $in: criteria.skills };
    }
    
    const alumni = await collection.find(query).toArray();
    return alumni.map(alumnus => ({
      ...alumnus,
      _id: alumnus._id.toString()
    })) as AlumniData[];
  }
}
