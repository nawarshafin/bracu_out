require('dotenv').config();
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

async function createRoleBasedUsers() {
  console.log('🚀 Creating Role-Based Users in MongoDB...\n');

  // Check if credentials are updated
  if (process.env.MONGODB_URI?.includes('your_real_username')) {
    console.log('❌ ERROR: Please update your .env file with actual MongoDB Atlas credentials!');
    console.log('Replace "your_real_username" and "your_real_password" with your real credentials.');
    return;
  }

  try {
    // Connect to MongoDB
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas successfully!');

    const db = client.db(process.env.MONGODB_DB || 'BRACU_Out');
    const usersCollection = db.collection('users');

    // Clear existing users (optional - remove this line if you want to keep existing users)
    // await usersCollection.deleteMany({});
    // console.log('🗑️  Cleared existing users');

    // Sample users with different roles
    const sampleUsers = [
      // Admin Users
      {
        email: "admin@bracu.edu.bd",
        username: "admin",
        password: "admin123",
        name: "System Administrator",
        role: "admin"
      },
      {
        email: "superadmin@bracu.edu.bd",
        username: "superadmin",
        password: "super123",
        name: "Super Administrator",
        role: "admin"
      },

      // Student Users
      {
        email: "student1@bracu.edu.bd",
        username: "student1",
        password: "student123",
        name: "John Doe",
        role: "student"
      },
      {
        email: "student2@bracu.edu.bd",
        username: "student2",
        password: "student456",
        name: "Jane Smith",
        role: "student"
      },
      {
        email: "rahim@student.bracu.edu.bd",
        username: "rahim_ahmed",
        password: "rahim123",
        name: "Rahim Ahmed",
        role: "student"
      },

      // Alumni Users
      {
        email: "alumni1@bracu.edu.bd",
        username: "alumni1",
        password: "alumni123",
        name: "Mike Johnson",
        role: "alumni"
      },
      {
        email: "alumni2@bracu.edu.bd",
        username: "alumni2",
        password: "alumni456",
        name: "Sarah Wilson",
        role: "alumni"
      },

      // Recruiter Users
      {
        email: "recruiter1@company.com",
        username: "recruiter1",
        password: "recruiter123",
        name: "David Brown",
        role: "recruiter"
      },
      {
        email: "hr@techcorp.com",
        username: "techcorp_hr",
        password: "tech123",
        name: "TechCorp HR Manager",
        role: "recruiter"
      }
    ];

    console.log('🔐 Creating users with hashed passwords...\n');

    for (const userData of sampleUsers) {
      try {
        // Check if user already exists
        const existingUser = await usersCollection.findOne({
          $or: [{ email: userData.email }, { username: userData.username }]
        });

        if (existingUser) {
          console.log(`⏭️  User ${userData.username} already exists, skipping...`);
          continue;
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(userData.password, 12);

        // Create user document
        const newUser = {
          email: userData.email,
          username: userData.username,
          password: hashedPassword,
          name: userData.name,
          role: userData.role,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        // Insert user into database
        const result = await usersCollection.insertOne(newUser);
        
        console.log(`✅ Created ${userData.role}: ${userData.username}`);
        console.log(`   Email: ${userData.email}`);
        console.log(`   Password: ${userData.password} (for testing)`);
        console.log(`   ID: ${result.insertedId}`);
        console.log('');

      } catch (error) {
        console.error(`❌ Error creating user ${userData.username}:`, error.message);
      }
    }

    // Display summary
    const totalUsers = await usersCollection.countDocuments();
    const usersByRole = await usersCollection.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } }
    ]).toArray();

    console.log('📊 Database Summary:');
    console.log(`   Total Users: ${totalUsers}`);
    usersByRole.forEach(role => {
      console.log(`   ${role._id}: ${role.count} users`);
    });

    console.log('\n🎉 User creation completed!');
    console.log('\n🔑 Test Credentials:');
    console.log('Admin: admin@bracu.edu.bd / admin123');
    console.log('Student: student1@bracu.edu.bd / student123');
    console.log('Alumni: alumni1@bracu.edu.bd / alumni123');
    console.log('Recruiter: recruiter1@company.com / recruiter123');

    await client.close();

  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.log('\n💡 Fix: Update your .env file with correct MongoDB Atlas credentials');
    } else if (error.message.includes('network')) {
      console.log('\n💡 Fix: Check your internet connection and MongoDB Atlas network settings');
    }
  }
}

// Run the script
createRoleBasedUsers().catch(console.error);
