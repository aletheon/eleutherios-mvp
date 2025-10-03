# Implementation Architecture

## Overview
This document details the technical implementation of the Eleutherios MVP platform, documenting architectural decisions, database design, and integration patterns that bring the PFSD theoretical model into a working system.

## Database Architecture

### Hybrid Firebase Approach
The platform uses a dual Firebase database strategy to optimize for different data access patterns:

#### Firestore (Document Database)
**Use Cases:**
- User profiles and authentication data
- Complex user queries and filtering
- Structured data with relationships
- Admin operations and data migration

**Advantages:**
- Rich querying capabilities
- Strong consistency
- Better for complex data structures
- Scalable for user management operations

**Implementation:**
```
users/
├── {userId}/
│   ├── name: string
│   ├── email: string
│   ├── role: string (normalized)
│   ├── certScore: object
│   ├── activities: object
│   ├── bio: string
│   ├── location: string
│   ├── createdAt: timestamp
│   └── updatedAt: timestamp
```

#### Realtime Database (JSON Tree)
**Use Cases:**
- Real-time messaging in forums
- Live collaboration features
- Simple key-value operations
- Event-driven updates

**Advantages:**
- Real-time synchronization
- Optimized for live updates
- Simple JSON structure
- Better performance for messaging

**Implementation:**
```
forums/
├── {forumId}/
│   ├── posts/
│   ├── participants/
│   └── metadata/
policies/
├── {policyId}/
services/
├── {serviceId}/
profiles/
├── {userId}/
```

### Data Migration System

#### Architecture Components
- **Preview Engine**: Analyzes required changes without modification
- **Batch Processor**: Handles multiple records with error tracking
- **Admin Interface**: Web-based migration control panel
- **API Layer**: REST endpoints for safe database operations

#### Migration Workflow
1. **Data Analysis**: Scan existing user records for inconsistencies
2. **Preview Generation**: Show changes without executing
3. **Validation**: Verify data integrity before migration
4. **Batch Execution**: Process records with rollback capability
5. **Monitoring**: Real-time progress and error tracking

## Authentication Architecture

### Firebase Authentication Integration
- **Registration Flow**: Two-step process with profile creation
- **Role-Based Access**: Dynamic permissions based on user roles
- **Protected Routes**: Client-side route protection
- **Profile Management**: Firestore integration for extended user data

### User Roles
```typescript
type UserRole = 
  | 'person'           // Person in need of services
  | 'caseworker'       // MSD case worker
  | 'housing-officer'  // Kainga Ora representative
  | 'healthcare-provider' // Medical professional
  | 'admin'            // System administrator
```

## Frontend Architecture

### Technology Stack
- **Framework**: Next.js 13+ with App Router
- **Styling**: Tailwind CSS with Material Icons
- **State Management**: React Hooks (useState, useEffect, useContext)
- **Type Safety**: TypeScript throughout

### Component Architecture
```
components/
├── Navigation.tsx          # Material Icons navigation
├── DashboardLayout.tsx     # Shared layout wrapper
├── UserProfile.tsx         # User display components
└── AdminTools.tsx          # Migration interfaces

contexts/
├── AuthContext.tsx         # Authentication state
└── DashboardContext.tsx    # Dashboard state

app/
├── admin/                  # Admin pages
├── api/                    # API routes
├── directory/              # User browsing
├── users/[id]/            # User profiles
├── policies/[id]/         # Policy details
├── forums/[id]/           # Forum interfaces
└── services/[id]/         # Service pages
```

### Navigation System
**Design Pattern**: Logo (activities toggle) → Center icons → User actions

**Material Icons Mapping:**
- Home: `home`
- Users: `people_alt`
- Policies: `account_balance`
- Forums: `forum`
- Services: `shopping_cart`

## API Architecture

### REST Endpoint Design
```
/api/users                 # User CRUD operations
/api/admin/migrate-users   # User data migration
/api/admin/preview-migration # Migration preview
/api/admin/debug-migration   # Migration debugging
```

### Error Handling Strategy
- **Client-side**: Graceful degradation with loading states
- **Server-side**: Detailed error logging with user-friendly messages
- **Migration**: Rollback capability with detailed error tracking

## Data Consistency Patterns

### User Data Standardization
**Problem Solved**: Mixed data formats from different user creation flows

**Solution Implementation:**
- Field name normalization (`displayName` → `name`)
- Role standardization (`"HomelessPerson"` → `"person"`)
- Required object creation (`certScore`, `activities`)
- Timestamp standardization

### CERT Score Implementation
```typescript
interface CERTScore {
  cooperation: number;    // Collaboration frequency
  engagement: number;     // Response quality
  retention: number;      // Platform loyalty
  trust: number;         // Community endorsements
  total?: number;        // Calculated sum
  lastUpdated: string;   // ISO timestamp
}
```

## Performance Considerations

### Database Optimization
- **Firestore**: Indexed queries for user directory
- **Realtime Database**: Denormalized data for messaging
- **Caching**: Client-side caching for user profiles
- **Pagination**: Efficient loading for large datasets

### Frontend Optimization
- **Code Splitting**: Route-based splitting with Next.js
- **Image Optimization**: Next.js Image component
- **Material Icons**: Font-based icons for performance
- **State Management**: Minimal re-renders with optimized hooks

## Security Implementation

### Authentication Security
- **Firebase Auth**: Industry-standard authentication
- **Route Protection**: Client and server-side validation
- **Role Verification**: Backend permission checking
- **Session Management**: Automatic token refresh

### Data Security
- **Firestore Rules**: Role-based read/write permissions
- **API Validation**: Request validation on all endpoints
- **Input Sanitization**: XSS prevention
- **CORS Configuration**: Restricted origins

## Deployment Architecture

### Development Environment
- **Local Development**: Firebase Emulator Suite
- **Environment Variables**: Separated config for dev/prod
- **Hot Reload**: Next.js development server
- **Database Switching**: Easy dev/prod database switching

### Production Considerations
- **Hosting**: Vercel deployment
- **Database**: Firebase production instances
- **Monitoring**: Error tracking and performance monitoring
- **Backup Strategy**: Regular database exports

## Integration Patterns

### Firebase Service Integration
```typescript
// Authentication + Database integration
const { user } = useAuth();
const userData = await getUserProfile(user.uid);

// Hybrid database access
const realtimeRef = ref(realtimeDb, `forums/${forumId}`);
const firestoreQuery = collection(firestoreDb, 'users');
```

### API Integration Patterns
```typescript
// REST API with error handling
const response = await fetch('/api/users', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' }
});

if (!response.ok) {
  throw new Error(`API error: ${response.statusText}`);
}
```

## Future Architecture Considerations

### Scalability Planning
- **Database Sharding**: Strategy for user growth
- **CDN Integration**: Asset delivery optimization
- **Microservices**: Potential service separation
- **Caching Layer**: Redis integration for high-traffic scenarios

### EleuScript Integration
- **Policy Parser**: EleuScript to JSON conversion
- **Rule Engine**: Policy rule execution system
- **Service Binding**: Automatic policy-service connections
- **Validation**: EleuScript syntax checking

This architecture successfully bridges the theoretical PFSD model with practical implementation requirements, providing a foundation for governance platform functionality while maintaining scalability and security.