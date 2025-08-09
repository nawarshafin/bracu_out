const { MongoClient } = require('mongodb');
require('dotenv').config();

async function verifyAndSetupMongoDB() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || 'BRACU_Out';
  
  if (!uri) {
    console.error('❌ MONGODB_URI not found in environment variables');
    console.log('   Please check your .env file');
    return false;
  }

  console.log('🔧 MongoDB Connection Verification & Setup');
  console.log('=' .repeat(50));
  console.log(`📋 Database: ${dbName}`);
  console.log(`🔗 URI: ${uri.replace(/:[^@]*@/, ':***@')}`);
  console.log();

  const client = new MongoClient(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });
  
  try {
    // Test connection
    console.log('🔄 Testing connection...');
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas successfully!');
    
    // Get database
    const db = client.db(dbName);
    
    // Test admin permissions
    console.log('🔄 Testing database permissions...');
    await db.admin().ping();
    console.log('✅ Database permissions verified!');
    
    // List existing collections
    console.log('\n📂 Existing Collections:');
    const collections = await db.listCollections().toArray();
    if (collections.length === 0) {
      console.log('   📝 No collections found - they will be created automatically');
    } else {
      collections.forEach((collection, index) => {
        console.log(`   ${index + 1}. ${collection.name}`);
      });
    }
    
    // Check Users collection specifically
    console.log('\n👥 Users Collection Analysis:');
    const usersCollection = db.collection('Users');
    const userCount = await usersCollection.countDocuments();
    console.log(`   📊 Total users: ${userCount}`);
    
    if (userCount > 0) {
      console.log('\n   📋 User roles breakdown:');
      const roleStats = await usersCollection.aggregate([
        {
          $group: {
            _id: '$role',
            count: { $sum: 1 }
          }
        },
        {
          $sort: { count: -1 }
        }
      ]).toArray();
      
      roleStats.forEach(stat => {
        console.log(`      ${stat._id}: ${stat.count} users`);
      });
      
      // Sample user structure
      console.log('\n   🔍 Sample user document structure:');
      const sampleUser = await usersCollection.findOne({});
      if (sampleUser) {
        const fields = Object.keys(sampleUser).filter(key => key !== 'password');
        console.log(`      Fields: ${fields.join(', ')}`);
        console.log(`      Has userName field: ${sampleUser.hasOwnProperty('userName')}`);
        console.log(`      Has username field: ${sampleUser.hasOwnProperty('username')}`);
      }
    }
    
    // Create indexes for better performance
    console.log('\n🔍 Setting up database indexes...');
    try {
      await usersCollection.createIndex({ email: 1 }, { unique: true, background: true });
      console.log('✅ Email index created/verified');
      
      await usersCollection.createIndex({ userName: 1 }, { sparse: true, background: true });
      console.log('✅ Username index created/verified');
      
      await usersCollection.createIndex({ role: 1 }, { background: true });
      console.log('✅ Role index created/verified');
      
    } catch (indexError) {
      console.log('ℹ️  Indexes may already exist:', indexError.message);
    }
    
    // Test basic operations
    console.log('\n🧪 Testing basic database operations...');
    
    // Test read operation
    const testRead = await usersCollection.findOne({});
    console.log('✅ Read operation successful');
    
    // Test connection health
    const dbStats = await db.stats();
    console.log(`✅ Database stats: ${dbStats.collections} collections, ${Math.round(dbStats.dataSize / 1024)} KB data`);
    
    console.log('\n🎉 MongoDB setup verification completed successfully!');
    console.log('\n📝 Configuration Summary:');
    console.log(`   • Database: ${dbName}`);
    console.log(`   • Collections: ${collections.length}`);
    console.log(`   • Users: ${userCount}`);
    console.log('   • Connection: ✅ Working');
    console.log('   • Indexes: ✅ Configured');
    console.log('   • Permissions: ✅ Verified');
    
    return true;
    
  } catch (error) {
    console.error('\n❌ MongoDB setup verification failed!');
    console.error('Error:', error.message);
    
    // Provide specific troubleshooting advice
    if (error.message.includes('authentication failed')) {
      console.log('\n🔧 Troubleshooting - Authentication:');
      console.log('   1. Check your username and password in MONGODB_URI');
      console.log('   2. Verify database user has proper permissions');
      console.log('   3. Ensure database user is added to the correct database');
    } else if (error.message.includes('network') || error.message.includes('timeout')) {
      console.log('\n🔧 Troubleshooting - Network:');
      console.log('   1. Check your internet connection');
      console.log('   2. Verify IP address is whitelisted in MongoDB Atlas');
      console.log('   3. Check firewall settings');
    } else if (error.message.includes('ServerSelectionTimeoutError')) {
      console.log('\n🔧 Troubleshooting - Server Selection:');
      console.log('   1. Verify cluster is running in MongoDB Atlas');
      console.log('   2. Check connection string format');
      console.log('   3. Ensure network access is configured');
    }
    
    return false;
    
  } finally {
    await client.close();
    console.log('\n🔐 Database connection closed');
  }
}

// Run verification
verifyAndSetupMongoDB().then(success => {
  process.exit(success ? 0 : 1);
});
