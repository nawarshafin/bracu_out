const { MongoClient } = require('mongodb');
require('dotenv').config();

async function testConnection() {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('❌ MONGODB_URI not found in environment variables');
    return;
  }

  console.log('🔄 Testing MongoDB Atlas connection...');
  console.log('📋 Connection URI:', uri.replace(/:[^@]*@/, ':***@')); // Hide password in logs
  
  const client = new MongoClient(uri);
  
  try {
    // Connect to MongoDB
    await client.connect();
    console.log('✅ Successfully connected to MongoDB Atlas!');
    
    // Test database access
    const db = client.db('BRACU_Out');
    console.log('📊 Connected to database: BRACU_Out');
    
    // List collections
    const collections = await db.listCollections().toArray();
    console.log('📁 Collections found:');
    collections.forEach(collection => {
      console.log(`   - ${collection.name}`);
    });
    
    if (collections.length === 0) {
      console.log('   📝 No collections found yet - they will be created when you add data');
    }
    
    // Test basic operations on Users collection
    const usersCollection = db.collection('users');
    const userCount = await usersCollection.countDocuments();
    console.log(`👥 Users collection: ${userCount} documents`);
    
    // Test basic operations on Job Postings collection  
    const jobsCollection = db.collection('Job Postings');
    const jobCount = await jobsCollection.countDocuments();
    console.log(`💼 Job Postings collection: ${jobCount} documents`);
    
    console.log('🎉 Database connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.error('🔐 Check your username and password');
    } else if (error.message.includes('network')) {
      console.error('🌐 Check your network connection and IP whitelist in MongoDB Atlas');
    }
  } finally {
    await client.close();
    console.log('🔐 Connection closed');
  }
}

testConnection();
