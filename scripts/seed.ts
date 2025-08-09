import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { UserService } from '../lib/models/User';

async function seedDatabase() {
  console.log('🌱 Seeding database...');

  try {
    // Check if admin user already exists
    const existingAdmin = await UserService.findByUsername('nawar');
    
    if (!existingAdmin) {
      // Create admin user
      const adminUser = await UserService.createUser({
        userName: 'nawar',
        password: '1234',
        name: 'Nawar Admin',
        role: 'admin',
        email: 'nawar@admin.com'
      });

      console.log('✅ Admin user created:', adminUser.userName);
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Create sample users for other roles
    const sampleUsers = [
      {
        userName: 'john_alumni',
        password: 'password123',
        name: 'John Alumni',
        role: 'alumni' as const,
        email: 'john@alumni.com'
      },
      {
        userName: 'jane_recruiter',
        password: 'password123',
        name: 'Jane Recruiter',
        role: 'recruiter' as const,
        email: 'jane@recruiter.com'
      },
      {
        userName: 'bob_student',
        password: 'password123',
        name: 'Bob Student',
        role: 'student' as const,
        email: 'bob@student.com'
      }
    ];

    for (const userData of sampleUsers) {
      const existingUser = await UserService.findByUsername(userData.userName);
      if (!existingUser) {
        await UserService.createUser(userData);
        console.log(`✅ Sample user created: ${userData.userName}`);
      } else {
        console.log(`ℹ️  Sample user already exists: ${userData.userName}`);
      }
    }

    console.log('🎉 Database seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
