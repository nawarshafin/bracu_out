# Bearer Token Authentication for Email Operations

This documentation explains how to use Bearer token authentication for email-related operations in the BRACU OUT system.

## Overview

Bearer token authentication has been implemented to secure email-related operations. This provides an additional layer of security for sensitive email operations beyond the standard NextAuth session-based authentication.

## Features

- **JWT-based Bearer tokens** with 24-hour expiration
- **Email-specific authentication** for sensitive operations
- **Role-based permissions** (admin can access all emails, users can access only their own)
- **Token verification** with database user validation
- **Secure email operations** with comprehensive error handling

## Setup

### 1. Install Dependencies

The following dependencies are required (already added to package.json):

```bash
npm install jsonwebtoken @types/jsonwebtoken
```

### 2. Environment Variables

Add the JWT secret to your `.env` file:

```env
JWT_SECRET=bracu-out-jwt-secret-key-2024
```

## API Endpoints

### 1. Generate Bearer Token

**Endpoint:** `POST /api/auth/bearer-token`

**Authentication:** NextAuth session required

**Description:** Generates a Bearer token for authenticated users with email addresses.

**Request:**
```bash
curl -X POST http://localhost:3001/api/auth/bearer-token \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"
```

**Response:**
```json
{
  "message": "Bearer token generated successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "username": "john_doe",
    "email": "john@bracu.ac.bd",
    "role": "student"
  },
  "expiresIn": "24h"
}
```

### 2. Email Profile Operations

**Endpoint:** `GET /api/user/email/profile?email=user@example.com`

**Authentication:** Bearer token required

**Description:** Get email profile information.

**Request:**
```bash
curl -X GET "http://localhost:3001/api/user/email/profile?email=john@bracu.ac.bd" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response:**
```json
{
  "message": "Email profile retrieved successfully",
  "profile": {
    "email": "john@bracu.ac.bd",
    "username": "john_doe",
    "name": "John Doe",
    "role": "student",
    "emailVerified": true,
    "lastLogin": "2024-08-08T10:25:41.000Z",
    "createdAt": "2024-08-01T10:25:41.000Z"
  },
  "requestedBy": {
    "username": "john_doe",
    "role": "student"
  }
}
```

**Update Email:**
```bash
curl -X PUT http://localhost:3001/api/user/email/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "currentEmail": "john@bracu.ac.bd",
    "newEmail": "john.doe@bracu.ac.bd"
  }'
```

### 3. Admin Email List

**Endpoint:** `GET /api/admin/emails/list`

**Authentication:** Bearer token required (Admin only)

**Description:** List all email addresses in the system.

**Request:**
```bash
curl -X GET http://localhost:3001/api/admin/emails/list \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response:**
```json
{
  "message": "Email list retrieved successfully",
  "stats": {
    "total": 156,
    "byRole": {
      "admin": 3,
      "alumni": 89,
      "recruiter": 12,
      "student": 52
    }
  },
  "emails": {
    "admin": [...],
    "alumni": [...],
    "recruiter": [...],
    "student": [...]
  },
  "retrievedBy": {
    "username": "admin_user",
    "role": "admin"
  }
}
```

### 4. Enhanced Student Registration

**Endpoint:** `POST /api/register/student`

**Authentication:** Optional Bearer token for enhanced email verification

**Description:** Register a new student with optional Bearer token authentication for email operations.

**Request (with Bearer auth):**
```bash
curl -X POST http://localhost:3001/api/register/student \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "username": "jane_doe",
    "name": "Jane Doe",
    "email": "jane@bracu.ac.bd",
    "password": "securePassword123",
    "studentId": "20301234",
    "major": "Computer Science",
    "year": "2024",
    "university": "BRAC University",
    "phone": "+8801234567890",
    "gpa": 3.75,
    "requireBearerAuth": true
  }'
```

## Usage Examples

### Frontend JavaScript Example

```javascript
// 1. First, get a Bearer token (after NextAuth login)
async function getBearerToken() {
  const response = await fetch('/api/auth/bearer-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include' // Include session cookies
  });
  
  const data = await response.json();
  return data.token;
}

// 2. Use Bearer token for email operations
async function getEmailProfile(email) {
  const token = await getBearerToken();
  
  const response = await fetch(`/api/user/email/profile?email=${email}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  
  return response.json();
}

// 3. Admin: Get all email addresses
async function getAllEmails() {
  const token = await getBearerToken();
  
  const response = await fetch('/api/admin/emails/list', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  return response.json();
}
```

### cURL Examples

```bash
# 1. Generate Bearer token (requires session cookie)
curl -X POST http://localhost:3001/api/auth/bearer-token \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"

# 2. Get user's own email profile
curl -X GET "http://localhost:3001/api/user/email/profile?email=user@bracu.ac.bd" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# 3. Admin: List all emails
curl -X GET http://localhost:3001/api/admin/emails/list \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN_HERE"

# 4. Update email address
curl -X PUT http://localhost:3001/api/user/email/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"currentEmail":"old@bracu.ac.bd","newEmail":"new@bracu.ac.bd"}'
```

## Security Features

1. **Token Expiration:** Tokens expire after 24 hours
2. **Database Verification:** Each request verifies the user still exists and email matches
3. **Role-based Access:** Admin can access any email, users only their own
4. **Secure Headers:** Proper Authorization header validation
5. **Error Handling:** Comprehensive error messages without exposing sensitive data

## Permission Matrix

| Role | Generate Token | View Own Email | View Any Email | Update Own Email | Update Any Email | List All Emails |
|------|---------------|---------------|---------------|-----------------|-----------------|----------------|
| **Admin** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Alumni** | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| **Recruiter** | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| **Student** | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Error Responses

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Valid Bearer token required for email operations"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "You do not have permission to access this email"
}
```

### 404 Not Found
```json
{
  "error": "User not found",
  "message": "No user found with this email address"
}
```

## Next Steps

To complete the implementation:

1. **Install dependencies:** Run `npm install` to install JWT packages
2. **Test endpoints:** Use the provided cURL examples
3. **Frontend integration:** Implement Bearer token usage in your React components
4. **Email verification:** Add email verification logic if needed
5. **Monitoring:** Add logging and monitoring for token usage

This Bearer token system provides secure, role-based access to email operations while maintaining the existing NextAuth session-based authentication for other operations.
