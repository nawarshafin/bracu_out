const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://nawarshafin2022:nawar123@cluster0.jxnswfw.mongodb.net/BRACU_Out';
const MONGODB_DB = process.env.MONGODB_DB || 'BRACU_Out';

async function diagnoseDatabase() {
  let client;
  
  try {
    console.log('🔍 Diagnosing MongoDB connection and database structure...');
    console.log('📊 Connection Details:');
    console.log('  URI:', MONGODB_URI.replace(/:\w+@/, ':****@')); // Hide password
    console.log('  Database:', MONGODB_DB);
    
    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Successfully connected to MongoDB');
    
    const db = client.db(MONGODB_DB);
    
    // List all databases
    const admin = client.db().admin();
    const databases = await admin.listDatabases();
    console.log('\n📁 Available Databases:');
    databases.databases.forEach(database => {
      console.log(`  - ${database.name} (${Math.round(database.sizeOnDisk / 1024)} KB)`);
    });
    
    // List collections in the current database
    console.log(`\n📂 Collections in "${MONGODB_DB}" database:`);
    const collections = await db.listCollections().toArray();
    
    if (collections.length === 0) {
      console.log('  ⚠️  No collections found in this database');
    } else {
      for (const collection of collections) {
        const collectionObj = db.collection(collection.name);
        const count = await collectionObj.countDocuments();
        console.log(`  - ${collection.name} (${count} documents)`);
      }
    }
    
    // Check for users in different collections
    console.log('\n👤 Searching for users across collections...');
    
    const possibleUserCollections = ['Users', 'users', 'User', 'recruiters', 'students', 'admins', 'alumni'];
    const userSummary = {};
    
    for (const collectionName of possibleUserCollections) {
      try {
        const collection = db.collection(collectionName);
        const count = await collection.countDocuments();
        
        if (count > 0) {
          // Get a sample document to understand structure
          const sample = await collection.findOne({});
          const recruiters = await collection.countDocuments({ role: 'recruiter' });
          const students = await collection.countDocuments({ role: 'student' });
          const admins = await collection.countDocuments({ role: 'admin' });
          const alumni = await collection.countDocuments({ role: 'alumni' });
          
          userSummary[collectionName] = {
            total: count,
            recruiters,
            students,
            admins,
            alumni,
            sample: sample ? {
              fields: Object.keys(sample),
              hasUsername: 'username' in sample,
              hasUserName: 'userName' in sample,
              hasEmail: 'email' in sample,
              hasPassword: 'password' in sample,
              role: sample.role || 'undefined'
            } : null
          };
          
          console.log(`  ✅ ${collectionName}: ${count} documents`);
          if (recruiters > 0) console.log(`    📊 Recruiters: ${recruiters}`);
          if (students > 0) console.log(`    📊 Students: ${students}`);
          if (admins > 0) console.log(`    📊 Admins: ${admins}`);
          if (alumni > 0) console.log(`    📊 Alumni: ${alumni}`);
        }
      } catch (error) {
        // Collection doesn't exist, skip
      }
    }
    
    // Specifically look for recruiters
    console.log('\n🎯 Searching specifically for recruiters...');
    let foundRecruiters = false;
    
    for (const collectionName of Object.keys(userSummary)) {
      const collection = db.collection(collectionName);
      
      // Search by role
      const recruitersByRole = await collection.find({ role: 'recruiter' }).toArray();
      if (recruitersByRole.length > 0) {
        console.log(`  ✅ Found ${recruitersByRole.length} recruiters in "${collectionName}" collection (by role)`);
        recruitersByRole.forEach((recruiter, index) => {
          console.log(`    ${index + 1}. Email: ${recruiter.email || 'N/A'}, Username: ${recruiter.username || recruiter.userName || 'N/A'}, Name: ${recruiter.name || 'N/A'}`);
        });
        foundRecruiters = true;
      }
      
      // Search by collection name (for dedicated recruiter collections)
      if (collectionName.toLowerCase().includes('recruiter')) {
        const allInCollection = await collection.find({}).toArray();
        if (allInCollection.length > 0) {
          console.log(`  ✅ Found ${allInCollection.length} entries in dedicated "${collectionName}" collection`);
          allInCollection.forEach((recruiter, index) => {
            console.log(`    ${index + 1}. Email: ${recruiter.email || 'N/A'}, Username: ${recruiter.username || recruiter.userName || 'N/A'}, Name: ${recruiter.name || 'N/A'}`);
          });
          foundRecruiters = true;
        }
      }
    }
    
    if (!foundRecruiters) {
      console.log('  ❌ No recruiters found in any collection');
      console.log('  💡 You may need to create a recruiter account first');
    }
    
    // Check authentication flow
    console.log('\n🔐 Testing authentication flow...');
    const usersCollection = db.collection('Users');
    const usersCount = await usersCollection.countDocuments();
    console.log(`  📊 Users collection has ${usersCount} documents`);
    
    if (usersCount > 0) {
      const sampleUser = await usersCollection.findOne({});
      console.log('  📝 Sample user structure:');
      console.log('    Fields:', Object.keys(sampleUser || {}));
      console.log('    Has userName:', 'userName' in (sampleUser || {}));
      console.log('    Has username:', 'username' in (sampleUser || {}));
    }
    
    console.log('\n📋 Summary:');
    console.log('  Database:', MONGODB_DB);
    console.log('  Collections found:', collections.length);
    console.log('  User-related collections:', Object.keys(userSummary).length);
    console.log('  Total users across all collections:', Object.values(userSummary).reduce((sum, info) => sum + info.total, 0));
    
    console.log('\n🔧 Recommendations:');
    if (!foundRecruiters) {
      console.log('  1. Create a recruiter account using the seed script or registration');
      console.log('  2. Ensure recruiters are stored in the same collection as other users (Users collection)');
    }
    
    const hasMultipleUserCollections = Object.keys(userSummary).length > 1;
    if (hasMultipleUserCollections) {
      console.log('  3. Consider consolidating users into a single collection for easier authentication');
    }
    
    const hasFieldMismatch = Object.values(userSummary).some(info => 
      info.sample && (info.sample.hasUsername !== info.sample.hasUserName)
    );
    if (hasFieldMismatch) {
      console.log('  4. Standardize username field names across collections (userName vs username)');
    }
    
  } catch (error) {
    console.error('❌ Database diagnosis failed:', error);
    if (error.code === 'ENOTFOUND') {
      console.log('💡 DNS resolution failed - check internet connection and MongoDB URI');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('💡 Connection refused - check if MongoDB service is running');
    } else if (error.name === 'MongoAuthenticationError') {
      console.log('💡 Authentication failed - check username and password in MONGODB_URI');
    }
  } finally {
    if (client) {
      await client.close();
      console.log('🔌 Disconnected from MongoDB');
    }
  }
}

// Run the diagnosis
if (require.main === module) {
  diagnoseDatabase().catch(console.error);
}

module.exports = { diagnoseDatabase };
