# MongoDB Connection Setup Guide

## ✅ Current Status

Your MongoDB connection is **properly configured and working**! Here's what has been verified:

- **Connection**: ✅ Successfully connected to MongoDB Atlas
- **Database**: ✅ `BRACU_Out` database exists with 8 collections
- **Users**: ✅ 4 users found in the `Users` collection
- **Authentication**: ✅ Email-based login is working
- **Indexes**: ✅ Performance indexes are configured

## 📋 Configuration Details

### Environment Variables (`.env`)
```env
MONGODB_URI=mongodb+srv://nawarshafin2022:nawar123@cluster0.jxnswfw.mongodb.net/BRACU_Out
MONGODB_DB=BRACU_Out
NEXTAUTH_SECRET=seocranet
NEXTAUTH_URL=http://localhost:3001
JWT_SECRET=bracu-out-jwt-secret-key-2024
```

### MongoDB Connection (`lib/mongodb.ts`)
- **Connection pooling**: Configured with optimal settings
- **Error handling**: Comprehensive error management
- **Development mode**: Global connection reuse for HMR
- **Production mode**: Fresh connections

### User Authentication (`lib/models/User.ts`)
- **Collection**: `Users` (matches your existing data)
- **Authentication**: Email-based login (primary)
- **Password**: Plain text storage (as per your current setup)
- **Fallback**: Username support with flexible field matching

## 🧪 Testing Commands

Use these npm scripts to test your MongoDB setup:

```bash
# Complete MongoDB verification and setup
npm run verify-mongodb

# Test authentication flow
npm run test-auth-flow

# Basic connection test
npm run test-connection

# Database diagnostics
npm run diagnose-db
```

## 👥 Current Users

Your database contains 4 test users:

1. **akida@example.com** (alumni) - Name: Akida
2. **tasnim@example.com** (graduate) - Name: Nida  
3. **islam@example.com** (alumni) - Name: faiyaz
4. **shafin@example.com** (recruiter) - Name: nawar

**Note**: All users have passwords but no `userName` fields. Authentication works via email.

## 🔐 Authentication Flow

### How Login Works:
1. User enters email/username and password
2. System searches for user by email first
3. If not found by email, tries username (fallback)
4. Validates password (plain text comparison)
5. Returns user object to NextAuth

### NextAuth Integration:
```javascript
// In [...nextauth].ts
async authorize(credentials, req) {
  const { email, username, password } = credentials;
  
  // Find user by email or username
  let user = await UserService.findByEmail(email) || 
             await UserService.findByUsername(username) ||
             await UserService.findByEmailOrUsername(email || username);
  
  // Validate password
  const isValid = await UserService.validatePassword(password, user.password);
  
  return isValid ? {
    id: user._id.toString(),
    name: user.name,
    userName: user.userName || user.email.split('@')[0],
    role: user.role,
    email: user.email
  } : null;
}
```

## 📊 Database Collections

Your `BRACU_Out` database contains:
- **Users** (4 documents) - Main user collection
- **Admin Verification** (0 documents)
- **Applications** (0 documents)
- **Messaging** (0 documents)
- **Referrals** (0 documents)
- **Alerts** (0 documents)
- **adminverifiers** (2 documents)
- **Job Postings** (0 documents)

## ⚡ Performance Optimizations

### Indexes Created:
- **Email index**: Unique, for fast email lookups
- **Username index**: Sparse, for username authentication
- **Role index**: For role-based queries

### Connection Settings:
- **Max pool size**: 10 connections
- **Server selection timeout**: 5 seconds
- **Socket timeout**: 45 seconds

## 🚀 Getting Started

1. **Start the application**:
   ```bash
   npm run dev
   ```

2. **Test login** with any of the existing users:
   - Use their email addresses as login
   - Passwords are stored in plain text in the database

3. **Verify everything is working**:
   ```bash
   npm run verify-mongodb
   ```

## ⚠️ Important Notes

### User Fields:
- **Missing userName**: All users lack `userName` fields, so login must use email
- **Plain text passwords**: Current setup stores passwords as plain text
- **Role-based access**: Users have different roles (admin, alumni, recruiter, student, graduate)

### Security Considerations:
- Consider hashing passwords in production
- Ensure MongoDB Atlas IP whitelist includes your deployment environment
- Regular database backups are recommended

## 🔧 Troubleshooting

### If you encounter connection issues:

1. **Check environment variables**:
   ```bash
   # Ensure .env file exists and contains MONGODB_URI
   cat .env
   ```

2. **Test basic connection**:
   ```bash
   npm run test-connection
   ```

3. **Common solutions**:
   - Verify MongoDB Atlas cluster is running
   - Check IP whitelist in Atlas (0.0.0.0/0 for development)
   - Confirm database user permissions
   - Ensure network access is configured

### If authentication fails:
1. Check if user exists: `npm run test-auth-flow`
2. Verify password field exists in user documents
3. Confirm NextAuth configuration matches User service

## 📞 Support

If you encounter any issues:
1. Run `npm run verify-mongodb` for complete diagnostics
2. Check the console output for specific error messages
3. Verify your MongoDB Atlas dashboard shows active connections

---

## ✅ Summary

Your MongoDB connection is **correctly configured** and ready for use:

- ✅ Connection string is valid
- ✅ Database exists with proper collections
- ✅ User authentication is working
- ✅ Performance indexes are in place
- ✅ Error handling is comprehensive

You can start your Next.js application with confidence that MongoDB is properly connected!
