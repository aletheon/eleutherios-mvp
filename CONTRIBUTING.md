# Contributing to Eleutherios

Thank you for your interest in contributing to Eleutherios! This guide will help you get started with contributing to our open source governance platform.

## Quick Start for Developers

### Prerequisites
- Node.js 18+
- Git
- Firebase project (for full functionality)

### Setup
```bash
# Clone the repository
git clone https://github.com/aletheon/eleutherios-mvp.git
cd eleutherios-mvp

# Install dependencies
npm install

# Copy environment template
cp .env.local.example .env.local
# Edit .env.local with your Firebase configuration

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the platform running locally.

## How to Contribute

### Types of Contributions

We welcome several types of contributions:

**Code Contributions:**
- Bug fixes and improvements
- New features (EleuScript parser, policy interfaces, service integrations)
- Performance optimizations
- Tests and documentation

**Non-Code Contributions:**
- Documentation improvements
- Translation and internationalization
- UX/UI design improvements
- Community governance examples
- Issue reporting and testing

**Community Contributions:**
- Answering questions in discussions
- Reviewing pull requests
- Helping new contributors get started
- Creating tutorials and examples

### Development Areas

**High Priority:**
- Policy creation interfaces
- Service registration workflows  
- EleuScript parser enhancements
- Forum creation tools
- Dynamic CERT scoring

**Medium Priority:**
- Service integration framework
- Advanced EleuScript features
- Real-time collaboration improvements
- Mobile responsiveness

**Community Needs:**
- Documentation improvements
- Example governance policies
- Internationalization
- Accessibility enhancements

## Development Process

### 1. Before You Start
- Check existing issues to see if your idea is already being worked on
- For major features, create an issue to discuss the approach first
- Read our [Code of Conduct](CODE_OF_CONDUCT.md)

### 2. Development Workflow
```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Make your changes
# Write tests if applicable
# Update documentation

# Test your changes
npm run test
npm run build

# Commit with clear messages
git commit -m "feat: add policy creation interface"

# Push and create pull request
git push origin feature/your-feature-name
```

### 3. Pull Request Guidelines
- Use clear, descriptive titles
- Include description of what changes and why
- Reference any related issues
- Include screenshots for UI changes
- Ensure all tests pass
- Update documentation if needed

## Project Structure

```
eleutherios-mvp/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── admin/             # Admin dashboard
│   │   ├── api/               # API endpoints
│   │   ├── directory/         # User directory
│   │   ├── forums/[id]/       # Forum interfaces
│   │   ├── policies/[id]/     # Policy pages
│   │   └── services/[id]/     # Service pages
│   ├── components/            # React components
│   │   ├── ui/               # Reusable UI components
│   │   └── forms/            # Form components
│   ├── lib/                   # Utility functions
│   │   ├── firebase.ts       # Firebase configuration
│   │   ├── eleuscript.ts     # EleuScript parser
│   │   └── utils.ts          # General utilities
│   └── types/                 # TypeScript type definitions
├── docs/                      # Documentation
├── public/                    # Static assets
└── tests/                     # Test files
```

## Technical Guidelines

### Code Style
- **Language**: TypeScript for all new code
- **Framework**: Next.js 13+ with App Router
- **Styling**: Tailwind CSS with semantic class names
- **Database**: Firestore for structured data, Realtime Database for messaging

### Naming Conventions
- **Files**: kebab-case for components, camelCase for utilities
- **Functions**: camelCase with descriptive names
- **Components**: PascalCase
- **Constants**: UPPER_SNAKE_CASE

### EleuScript Development
- **Parser Location**: `src/lib/eleuscript.ts`
- **Testing**: Add test cases for new rule types
- **Documentation**: Update `docs/eleuscript.md` for syntax changes
- **Examples**: Add working examples to `docs/examples.md`

### Database Guidelines
- **Firestore**: Use for policies, users, services (structured queries)
- **Realtime Database**: Use for forums, messages (real-time updates)
- **Security Rules**: Update rules for new data structures
- **Migrations**: Create migration scripts for schema changes

## Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run integration tests
npm run test:integration
```

### Writing Tests
- **Unit Tests**: For utility functions and EleuScript parser
- **Component Tests**: For React components
- **Integration Tests**: For API endpoints and database operations
- **E2E Tests**: For critical user workflows

### Test Structure
```typescript
// Example test structure
describe('EleuScript Parser', () => {
  it('should parse basic policy rule', () => {
    const input = 'rule AddHealthcare -> Policy("HealthcareAccess")';
    const result = parseEleuScript(input);
    expect(result.type).toBe('policy');
    expect(result.name).toBe('HealthcareAccess');
  });
});
```

## Documentation

### Types of Documentation

**Developer Documentation:**
- API documentation
- Component documentation
- Database schema documentation
- Deployment guides

**User Documentation:**
- EleuScript language guide
- Governance examples
- Platform usage tutorials
- Administrator guides

### Documentation Standards
- Use clear, simple language
- Include code examples
- Keep documentation up-to-date with code changes
- Use proper markdown formatting

## Issue Reporting

### Bug Reports
Use the bug report template and include:
- Steps to reproduce
- Expected vs actual behavior
- Environment details (browser, OS)
- Screenshots if applicable

### Feature Requests
Use the feature request template and include:
- Problem you're trying to solve
- Proposed solution
- Alternative solutions considered
- Additional context

## Community Guidelines

### Getting Help
- **GitHub Discussions**: For questions and community discussion
- **Issues**: For bug reports and feature requests
- **Email**: rob.kara@gmail.com for sensitive issues

### Communication
- Be respectful and inclusive
- Use clear, descriptive language
- Provide context for your contributions
- Be patient with review process

### Code Review Process
- All contributions require review
- Reviews focus on code quality, functionality, and project fit
- Address feedback constructively
- Maintainers have final decision on contributions

## Recognition

### Contributors
- All contributors are listed in project documentation
- Significant contributors may be invited to join the maintainer team
- Community contributions are highlighted in release notes

### CERT Scoring
As a governance platform, contributor activity feeds into the CERT (Cooperation, Engagement, Retention, Trust) scoring system, recognizing valuable community participation.

## Development Environment Setup

### Firebase Configuration
For full functionality, you'll need Firebase project with:
- **Authentication**: Email/password and role-based access
- **Firestore**: Main database for structured data
- **Realtime Database**: For real-time forum messaging
- **Storage**: For file uploads (optional)

### Environment Variables
```bash
# .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
FIREBASE_DATABASE_URL=your_realtime_db_url

# Optional for payment testing
STRIPE_SECRET_KEY=your_stripe_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### Development vs Production
- **Development**: Use Firebase Emulators for local testing
- **Production**: Live Firebase project for deployed testing
- **Testing**: Separate test Firebase project recommended

## Release Process

### Version Management
- Semantic versioning (MAJOR.MINOR.PATCH)
- Feature releases: Minor version bump
- Bug fixes: Patch version bump
- Breaking changes: Major version bump

### Release Checklist
- [ ] All tests passing
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Version bumped in package.json
- [ ] Database migrations (if needed)
- [ ] Deployment tested

## Questions?

If you have questions about contributing, feel free to:
- Open a GitHub Discussion
- Create an issue with the "question" label
- Email the maintainers at rob.kara@gmail.com

We're here to help you contribute successfully to Eleutherios!

---

**Thank you for contributing to open source governance coordination!**