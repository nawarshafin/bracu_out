const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'BRACU_Out';

async function hashExistingPasswords() {
  console.log('🔐 Hashing existing plain text passwords...\n');
  
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db(dbName);
    const usersCollection = db.collection('Users');
    
    // Get all users
    const users = await usersCollection.find({}).toArray();
    console.log(`📋 Found ${users.length} users to process\n`);
    
    for (const user of users) {
      console.log(`🔄 Processing ${user.name} (${user.email})...`);
      
      // Check if password is already hashed (bcrypt hashes start with $2a$, $2b$, or $2y$)
      if (user.password && !user.password.startsWith('$2')) {
        console.log(`   Current password: ${user.password}`);
        
        // Hash the plain text password
        const hashedPassword = await bcrypt.hash(user.password, 12);
        console.log(`   Hashed password: ${hashedPassword.substring(0, 30)}...`);
        
        // Update the user with hashed password
        await usersCollection.updateOne(
          { _id: user._id },
          { 
            $set: { 
              password: hashedPassword,
              updatedAt: new Date()
            }
          }
        );
        
        console.log(`   ✅ Password updated for ${user.name}\n`);
      } else {
        console.log(`   ⏭️  Password already hashed for ${user.name}\n`);
      }
    }
    
    console.log('🎉 All passwords have been hashed successfully!');
    
    // Test login with one user
    console.log('\n🧪 Testing login with hashed password...');
    const testUser = await usersCollection.findOne({ email: 'akida@example.com' });
    if (testUser) {
      const isValidPassword = await bcrypt.compare('akida123', testUser.password);
      console.log(`Test login for Akida: ${isValidPassword ? '✅ SUCCESS' : '❌ FAILED'}`);
    }
    
  } catch (error) {
    console.error('❌ Error hashing passwords:', error.message);
  } finally {
    await client.close();
  }
}

hashExistingPasswords();
