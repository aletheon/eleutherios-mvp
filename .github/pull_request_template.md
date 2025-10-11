## Description

Brief description of what this PR does and why.

**Type of Change:**
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Refactoring (no functional changes)
- [ ] Performance improvement
- [ ] Other: _______________

## Changes Made

Detailed description of the specific changes:

**Code Changes:**
- [ ] Frontend components
- [ ] Backend API endpoints
- [ ] Database schema or queries
- [ ] EleuScript parser modifications
- [ ] Authentication/authorization changes
- [ ] Payment processing updates
- [ ] Real-time messaging improvements
- [ ] Other: _______________

**Documentation Changes:**
- [ ] README updates
- [ ] API documentation
- [ ] EleuScript language docs
- [ ] Code comments
- [ ] Examples or tutorials
- [ ] Other: _______________

## Related Issues

Fixes #(issue number)
Relates to #(issue number)
Implements #(issue number)

## Testing

**How has this been tested?**
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing performed
- [ ] EleuScript rule testing
- [ ] Forum functionality testing
- [ ] Payment processing testing
- [ ] Cross-browser testing
- [ ] Mobile device testing

**Test Details:**
```
Describe the specific tests you ran and their results
```

## Screenshots (if applicable)

If your changes affect the UI, please include before/after screenshots:

**Before:**
<!-- Screenshot or description of previous behavior -->

**After:** 
<!-- Screenshot or description of new behavior -->

## EleuScript Impact (if applicable)

**New Syntax Added:**
```eleuscript
# Example of new EleuScript syntax (if any)
rule NewFeature -> Service("ExampleService", param=value)
```

**Breaking Changes:**
- [ ] This PR changes existing EleuScript syntax
- [ ] This PR changes database schema
- [ ] This PR changes API endpoints
- [ ] This PR affects existing governance workflows

If yes, describe the breaking changes and migration path:

## Database Changes (if applicable)

**Schema Changes:**
- [ ] New collections/tables added
- [ ] Fields added to existing collections
- [ ] Fields removed or renamed
- [ ] Indexes added or modified
- [ ] Migration script needed

**Migration Required:**
- [ ] Yes - migration script included
- [ ] Yes - manual migration steps documented
- [ ] No - backward compatible changes only

## Performance Impact

**Performance Considerations:**
- [ ] No performance impact expected
- [ ] Performance improvement expected
- [ ] Potential performance impact (explain below)
- [ ] Performance testing completed

**Details:**
<!-- Describe any performance implications -->

## Security Considerations

**Security Impact:**
- [ ] No security implications
- [ ] Authentication/authorization changes
- [ ] Data privacy implications
- [ ] Payment security considerations
- [ ] External service integration security
- [ ] Other security considerations (explain below)

**Security Review:**
- [ ] Sensitive data handling reviewed
- [ ] Input validation implemented
- [ ] Authorization checks in place
- [ ] Security best practices followed

## Checklist

**Code Quality:**
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] My changes generate no new warnings or errors
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes

**Documentation:**
- [ ] I have updated the documentation accordingly
- [ ] I have updated EleuScript docs if syntax changed
- [ ] I have added/updated code comments where necessary
- [ ] I have updated examples if applicable

**Community:**
- [ ] I have read the CONTRIBUTING.md guidelines
- [ ] I have followed the Code of Conduct
- [ ] I have tested this change across different user roles (person, caseworker, admin)
- [ ] I have considered the impact on different governance use cases

## Additional Notes

Any additional information, context, or considerations for reviewers:

**Reviewer Notes:**
- Special areas to focus on during review
- Known limitations or future improvements needed
- Dependencies on other PRs or external factors

**Future Work:**
- Related features or improvements that could build on this
- Technical debt or refactoring opportunities identified
- Documentation or testing that could be improved

---

**For Maintainers:**

**Review Priority:**
- [ ] Critical (security, data loss, breaking changes)
- [ ] High (major features, significant improvements)
- [ ] Medium (minor features, bug fixes)
- [ ] Low (documentation, minor improvements)

**Deployment Considerations:**
- [ ] Requires database migration
- [ ] Requires environment variable updates
- [ ] Requires external service configuration
- [ ] Safe to deploy immediately