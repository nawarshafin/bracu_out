const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const MONGODB_DB = process.env.MONGODB_DB || 'bracu_out';
const DEFAULT_PASSWORD = 'password123'; // Default password for migrated users

async function migrateToplainPasswords() {
  let client;
  
  try {
    console.log('🔄 Starting migration from hashed to plain text passwords...');
    console.log('⚠️  WARNING: This is extremely insecure and only for development/testing!');
    
    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db(MONGODB_DB);
    
    // Collections to migrate
    const collections = [
      { name: 'Users', usernameField: 'userName' },
      { name: 'users', usernameField: 'userName' },
      { name: 'students', usernameField: 'username' },
      { name: 'admins', usernameField: 'username' },
      { name: 'alumni', usernameField: 'username' },
      { name: 'recruiters', usernameField: 'username' }
    ];
    
    let totalMigrated = 0;
    const migratedUsers = [];
    
    for (const { name, usernameField } of collections) {
      try {
        const collection = db.collection(name);
        
        // Check if collection exists
        const collectionInfo = await db.listCollections({ name }).toArray();
        if (collectionInfo.length === 0) {
          console.log(`⚠️  Collection "${name}" does not exist, skipping...`);
          continue;
        }
        
        // Find all users with passwords that look like bcrypt hashes (start with $2a$, $2b$, etc.)
        const usersWithHashedPasswords = await collection.find({
          password: { $regex: /^\$2[ayb]\$/ }
        }).toArray();
        
        if (usersWithHashedPasswords.length === 0) {
          console.log(`✅ No hashed passwords found in collection "${name}"`);
          continue;
        }
        
        console.log(`🔄 Found ${usersWithHashedPasswords.length} users with hashed passwords in "${name}"`);
        
        // Update each user's password to plain text
        for (const user of usersWithHashedPasswords) {
          const username = user[usernameField] || user.email || user._id.toString();
          
          await collection.updateOne(
            { _id: user._id },
            { 
              $set: { 
                password: DEFAULT_PASSWORD,
                updatedAt: new Date(),
                // Add a flag to indicate this was migrated
                passwordMigrated: true,
                passwordMigratedAt: new Date()
              }
            }
          );
          
          migratedUsers.push({
            collection: name,
            username: username,
            email: user.email,
            role: user.role
          });
          
          totalMigrated++;
          console.log(`✅ Migrated user: ${username} in collection "${name}"`);
        }
        
      } catch (error) {
        console.error(`❌ Error processing collection "${name}":`, error.message);
      }
    }
    
    console.log('\n📊 Migration Summary:');
    console.log(`Total users migrated: ${totalMigrated}`);
    console.log(`Default password set for all migrated users: "${DEFAULT_PASSWORD}"`);
    
    if (migratedUsers.length > 0) {
      console.log('\n👥 Migrated Users:');
      migratedUsers.forEach(user => {
        console.log(`- ${user.username} (${user.email || 'No email'}) - Role: ${user.role || 'Unknown'} - Collection: ${user.collection}`);
      });
      
      console.log('\n🚨 IMPORTANT SECURITY NOTICE:');
      console.log('1. All migrated users now have the password: ' + DEFAULT_PASSWORD);
      console.log('2. Users should change their passwords immediately after login');
      console.log('3. This configuration is EXTREMELY INSECURE and should NEVER be used in production');
      console.log('4. Consider implementing proper password policies and user notification systems');
    }
    
    console.log('\n✅ Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    if (client) {
      await client.close();
      console.log('🔌 Disconnected from MongoDB');
    }
  }
}

// Run the migration
if (require.main === module) {
  migrateToplainPasswords().catch(console.error);
}

module.exports = { migrateToplainPasswords };
