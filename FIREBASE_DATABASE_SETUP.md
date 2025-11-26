# Firebase Realtime Database Setup

## Issue
The services create page was showing "Failed to fetch policies" error because the Firebase Realtime Database had restrictive security rules (403 Forbidden).

## Solution
We've added database security rules to allow public read access to policies while requiring authentication for writes.

## Deployment Steps

### 1. Install Firebase CLI (if not already installed)
```bash
npm install -g firebase-tools
```

### 2. Login to Firebase
```bash
firebase login
```

### 3. Deploy Database Rules
```bash
firebase deploy --only database
```

This will deploy the rules defined in `database.rules.json` to your Firebase Realtime Database.

## Security Rules Explanation

The `database.rules.json` file contains the following rules:

```json
{
  "rules": {
    "policies": {
      ".read": true,                    // Anyone can read policies
      ".write": "auth != null",         // Only authenticated users can write
      "$policyId": {
        ".validate": "newData.hasChildren(['title', 'createdAt', 'status'])"
      }
    },
    ".read": false,                     // Deny read for all other paths
    ".write": false                     // Deny write for all other paths
  }
}
```

### What this means:
- **Policies**: Can be read by anyone (public read access)
- **Writing policies**: Requires user authentication
- **Validation**: Ensures policies have required fields (title, createdAt, status)
- **Other data**: Remains protected (read/write denied by default)

## Changes Made

1. **database.rules.json**: Created Firebase Realtime Database security rules
2. **firebase.json**: Updated to include database rules configuration
3. **src/app/services/create/page.tsx**:
   - Added better error handling
   - Shows user-friendly error messages
   - Includes retry functionality
   - Allows service creation even when policies can't be loaded

## Testing

After deploying the rules:

1. Visit `/services/create` page
2. The policies should now load successfully
3. If policies still don't load, check the Firebase Console for any database issues
4. Check the browser console for detailed error messages

## Alternative: Manual Rule Deployment

If you prefer to set rules manually:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `eleutherios-mvp-3c717`
3. Navigate to **Realtime Database** → **Rules**
4. Copy and paste the rules from `database.rules.json`
5. Click **Publish**

## Verification

To verify the rules are working:

```bash
curl https://eleutherios-mvp-3c717-default-rtdb.asia-southeast1.firebasedatabase.app/policies.json
```

This should return policy data (or null if no policies exist) instead of a 403 error.
