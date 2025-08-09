const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bracu_out';

async function createTestUsers() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db('bracu_out');
    
    console.log('Creating test users...');
    
    // Create test student
    const studentCollection = db.collection('students');
    const studentData = {
      username: 'student1',
      password: await bcrypt.hash('password123', 12),
      name: 'John Student',
      email: 'student@example.com',
      studentId: 'STU001',
      major: 'Computer Science',
      year: 'junior',
      university: 'BRAC University',
      phone: '01234567890',
      gpa: 3.8,
      enrolledCourses: ['CSE101', 'CSE102'],
      completedAssignments: 10,
      role: 'student',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await studentCollection.insertOne(studentData);
    console.log('✅ Test student created: username=student1, password=password123');
    
    // Create test recruiter
    const recruiterCollection = db.collection('recruiters');
    const recruiterData = {
      username: 'recruiter1',
      password: await bcrypt.hash('password123', 12),
      name: 'Jane Recruiter',
      email: 'recruiter@example.com',
      company: 'Tech Corp',
      position: 'Senior Recruiter',
      phone: '01234567891',
      website: 'https://techcorp.com',
      industry: 'Technology',
      companySize: '201-1000',
      activeJobPosts: 5,
      totalApplications: 150,
      interviewsScheduled: 20,
      successfulHires: 8,
      role: 'recruiter',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await recruiterCollection.insertOne(recruiterData);
    console.log('✅ Test recruiter created: username=recruiter1, password=password123');
    
    // Create test alumni
    const alumniCollection = db.collection('alumni');
    const alumniData = {
      username: 'alumni1',
      password: await bcrypt.hash('password123', 12),
      name: 'Mike Alumni',
      email: 'alumni@example.com',
      studentId: 'ALU001',
      graduationYear: 2020,
      degree: 'Bachelor of Science',
      major: 'Software Engineering',
      university: 'BRAC University',
      currentCompany: 'Innovation Labs',
      currentPosition: 'Senior Developer',
      industry: 'Technology',
      phone: '01234567892',
      linkedIn: 'https://linkedin.com/in/mikealumni',
      mentoring: true,
      yearsOfExperience: 3,
      skills: ['JavaScript', 'Python', 'React', 'Node.js'],
      achievements: ['Employee of the Month', 'Tech Lead Promotion'],
      role: 'alumni',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await alumniCollection.insertOne(alumniData);
    console.log('✅ Test alumni created: username=alumni1, password=password123');
    
    // Create test admin
    const adminCollection = db.collection('admins');
    const adminData = {
      username: 'admin1',
      password: await bcrypt.hash('password123', 12),
      name: 'Sarah Admin',
      email: 'admin@example.com',
      phone: '01234567893',
      department: 'IT Administration',
      position: 'System Administrator',
      permissions: ['read', 'write', 'delete', 'manage_users'],
      isSuper: true,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await adminCollection.insertOne(adminData);
    console.log('✅ Test admin created: username=admin1, password=password123');
    
    console.log('\n🎉 All test users created successfully!');
    console.log('\nYou can now test login with these credentials:');
    console.log('Student: student1 / password123');
    console.log('Recruiter: recruiter1 / password123');
    console.log('Alumni: alumni1 / password123');
    console.log('Admin: admin1 / password123');
    
  } catch (error) {
    console.error('Error creating test users:', error);
  } finally {
    await client.close();
  }
}

// Run the script
createTestUsers();
