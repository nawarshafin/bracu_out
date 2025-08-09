# Plain Text Password Authentication Setup

⚠️ **SECURITY WARNING**: This configuration stores passwords in plain text, which is **EXTREMELY INSECURE** and should **NEVER** be used in production environments.

## Changes Made

This application has been modified to store and authenticate passwords in plain text format instead of using bcrypt hashing. The following files were modified:

### Models Updated:
- `lib/models/User.ts`
- `lib/models/Student.ts`
- `lib/models/Admin.ts`
- `lib/models/Alumni.ts`
- `lib/models/Recruiter.ts`

### Changes in Each Model:
1. Removed `bcrypt` import
2. Updated `createUser`/`createStudent`/etc. methods to store plain text passwords
3. Updated `validatePassword` methods to perform direct string comparison
4. Updated password update methods to store plain text passwords

## Migration from Hashed Passwords

If you have existing users with hashed passwords, run the migration script:

```bash
npm run migrate-plain-passwords
```

This script will:
- Find all users with bcrypt-hashed passwords
- Reset their passwords to `password123` (default)
- Add migration flags to track which users were migrated

## User Creation

### New Users
New users will have their passwords stored in plain text format automatically.

### Example Registration:
```javascript
// Student registration
const newStudent = await StudentService.createStudent({
  username: 'john_doe',
  password: 'myplainpassword', // This will be stored as-is
  name: 'John Doe',
  email: 'john@example.com',
  // ... other fields
});
```

## Authentication

### Login Process:
```javascript
// During login in NextAuth
const user = await UserService.findByEmail(email);
const isValid = await UserService.validatePassword(password, user.password);
// This now does: return password === user.password
```

## Security Implications

### Why This Is Dangerous:
1. **Data Breach Risk**: If your database is compromised, all user passwords are immediately visible
2. **Internal Access**: Anyone with database access can see all passwords
3. **Logging Risk**: Passwords might accidentally be logged in plain text
4. **Compliance Issues**: Violates security standards and regulations
5. **No Protection**: Zero protection against internal threats

### Recommendations:
- **Use only for development/testing**: Never deploy this to production
- **Local environment only**: Keep this configuration on local machines only
- **Regular security review**: Implement proper password hashing before any deployment
- **User notification**: If migrating existing users, notify them to change passwords

## Reverting to Secure Passwords

To restore secure password handling:

1. Reinstall bcrypt:
   ```bash
   npm install bcryptjs
   npm install --save-dev @types/bcryptjs
   ```

2. Restore the original code:
   - Add back `import bcrypt from 'bcryptjs'` to all model files
   - Restore `bcrypt.hash()` calls in create/update methods
   - Restore `bcrypt.compare()` calls in validate methods

3. Run a migration to hash existing plain text passwords

## Environment Variables

Make sure you have the required environment variables:

```env
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB=your_database_name
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

## Default Migrated Password

After running the migration script, all migrated users will have the password: `password123`

Users should be instructed to:
1. Login with their username/email and password `password123`
2. Immediately change their password
3. Use a strong, unique password

## Testing

You can test the authentication by:

1. Creating a new user with a plain text password
2. Attempting to login with that exact password
3. Verifying that authentication succeeds

## Support

This configuration is provided for development/testing purposes only. For production applications, always use proper password hashing with bcrypt or similar libraries.
