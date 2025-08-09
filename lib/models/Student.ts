import clientPromise from '../mongodb';

export interface StudentData {
  _id?: string;
  username: string;
  password: string;
  name: string;
  email: string;
  studentId: string;
  major: string;
  year: 'freshman' | 'sophomore' | 'junior' | 'senior' | 'graduate';
  university: string;
  phone?: string;
  gpa?: number;
  enrolledCourses?: string[];
  completedAssignments?: number;
  role: 'student';
  createdAt?: Date;
  updatedAt?: Date;
}

export class StudentService {
  private static async getCollection() {
    const client = await clientPromise;
    const db = client.db('bracu_out');
    return db.collection('students');
  }

  static async findByUsername(username: string): Promise<StudentData | null> {
    const collection = await this.getCollection();
    return await collection.findOne({ username }) as StudentData | null;
  }

  static async findByStudentId(studentId: string): Promise<StudentData | null> {
    const collection = await this.getCollection();
    return await collection.findOne({ studentId }) as StudentData | null;
  }

  static async findByEmail(email: string): Promise<StudentData | null> {
    const collection = await this.getCollection();
    return await collection.findOne({ email }) as StudentData | null;
  }

  static async createStudent(studentData: Omit<StudentData, '_id' | 'createdAt' | 'updatedAt'>): Promise<StudentData> {
    const collection = await this.getCollection();
    
    // Check if student already exists
    const existingStudent = await this.findByUsername(studentData.username);
    if (existingStudent) {
      throw new Error('Student with this username already exists');
    }

    const existingStudentId = await this.findByStudentId(studentData.studentId);
    if (existingStudentId) {
      throw new Error('Student with this ID already exists');
    }

    const existingEmail = await this.findByEmail(studentData.email);
    if (existingEmail) {
      throw new Error('Student with this email already exists');
    }
    
    const newStudent = {
      ...studentData,
      password: studentData.password, // Store plain text password
      role: 'student' as const,
      enrolledCourses: studentData.enrolledCourses || [],
      completedAssignments: studentData.completedAssignments || 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await collection.insertOne(newStudent);
    return { ...newStudent, _id: result.insertedId.toString() };
  }

  static async validatePassword(plainPassword: string, storedPassword: string): Promise<boolean> {
    return plainPassword === storedPassword; // Direct plain text comparison
  }

  static async getAllStudents(): Promise<StudentData[]> {
    const collection = await this.getCollection();
    const students = await collection.find({}).toArray();
    return students.map(student => ({
      ...student,
      _id: student._id.toString()
    })) as StudentData[];
  }

  static async updateStudent(username: string, updateData: Partial<StudentData>): Promise<boolean> {
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

  static async deleteStudent(username: string): Promise<boolean> {
    const collection = await this.getCollection();
    const result = await collection.deleteOne({ username });
    return result.deletedCount > 0;
  }

  static async updateCourseProgress(username: string, courseData: { enrolledCourses?: string[], completedAssignments?: number }): Promise<boolean> {
    const collection = await this.getCollection();
    
    const result = await collection.updateOne(
      { username },
      { 
        $set: {
          ...courseData,
          updatedAt: new Date()
        }
      }
    );
    
    return result.modifiedCount > 0;
  }
}
