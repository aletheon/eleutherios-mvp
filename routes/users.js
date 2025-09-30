// routes/users.js - Updated to match Eleutherios schema v2
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// Mock database service - replace with your actual database
class UserService {
    constructor() {
        this.users = this.generateSchemaCompliantUsers();
        this.activities = this.generateActivities();
        this.services = this.generateServices();
        this.policies = this.generatePolicies();
        this.forums = this.generateForums();
    }

    generateSchemaCompliantUsers() {
        const names = [
            'Alice Johnson', 'Bob Smith', 'Carol Davis', 'David Wilson',
            'Eva Brown', 'Frank Miller', 'Grace Lee', 'Henry Taylor',
            'Iris Chen', 'Jack Anderson', 'Kate Rodriguez', 'Leo Thompson',
            'Maria Garcia', 'Noah Wright', 'Olivia King', 'Paul Scott'
        ];

        const emails = names.map(name => 
            `${name.toLowerCase().replace(/\s+/g, '.')}@eleutherios.org`
        );

        return names.map((name, index) => {
            const userId = uuidv4();
            const numServices = Math.floor(Math.random() * 5);
            const numFollowers = Math.floor(Math.random() * 100);
            const numFollowing = Math.floor(Math.random() * 80);
            
            return {
                id: userId,
                name: name,
                email: emails[index],
                bio: this.generateBio(), // Not in schema but useful for display
                avatar: name.split(' ').map(n => n[0]).join(''),
                
                // CERT Score (aggregate) - calculated from activities
                certScore: this.calculateCERTScore({
                    cooperation: Math.floor(Math.random() * 100),
                    engagement: Math.floor(Math.random() * 100),
                    retention: Math.floor(Math.random() * 100),
                    trust: numFollowers
                }),
                
                // Schema-compliant fields
                services: this.generateServiceIds(numServices),
                activities: this.generateActivityIds(Math.floor(Math.random() * 10)),
                followers: this.generateUserIds(numFollowers),
                following: this.generateUserIds(numFollowing),
                favourites: this.generateServiceIds(Math.floor(Math.random() * 8)),
                
                // Metadata
                createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
                lastActive: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
                
                // Additional display data (not in core schema)
                location: ['Christchurch, NZ', 'Auckland, NZ', 'Wellington, NZ', 'Sydney, AU', 'Melbourne, AU'][Math.floor(Math.random() * 5)],
                reputation: Math.floor(Math.random() * 1000),
                isPublic: Math.random() > 0.2 // 80% of users are public
            };
        });
    }

    generateBio() {
        const bios = [
            'Policy researcher focused on sustainable governance models',
            'Community organizer with expertise in participatory democracy',
            'Tech entrepreneur building governance solutions',
            'Social scientist studying collective decision-making',
            'Legal expert in constitutional frameworks',
            'Data analyst for policy impact measurement',
            'Forum moderator and conflict resolution specialist',
            'Service provider for digital identity verification',
            'Governance consultant for DAOs and cooperatives',
            'Academic researcher in political science',
            'Community builder and stakeholder engagement expert',
            'Software developer contributing to open governance'
        ];
        return bios[Math.floor(Math.random() * bios.length)];
    }

    calculateCERTScore({ cooperation, engagement, retention, trust }) {
        // Weighted average with trust having higher weight due to followers
        const normalizedTrust = Math.min(trust * 2, 100); // Scale followers to 0-100
        return Math.round((cooperation + engagement + retention + normalizedTrust) / 4);
    }

    generateServiceIds(count) {
        const serviceIds = [];
        for (let i = 0; i < count; i++) {
            serviceIds.push(uuidv4());
        }
        return serviceIds;
    }

    generateActivityIds(count) {
        const activityIds = [];
        for (let i = 0; i < count; i++) {
            activityIds.push(uuidv4());
        }
        return activityIds;
    }

    generateUserIds(count) {
        const userIds = [];
        for (let i = 0; i < Math.min(count, 20); i++) { // Limit to reasonable number
            userIds.push(uuidv4());
        }
        return userIds;
    }

    generateActivities() {
        // Mock activities for display purposes
        return this.users.map(user => ({
            id: uuidv4(),
            userId: user.id,
            forumRefs: this.generateForumIds(Math.floor(Math.random() * 5)),
            policyRefs: this.generatePolicyIds(Math.floor(Math.random() * 3)),
            timestamp: new Date().toISOString()
        }));
    }

    generateForumIds(count) {
        const forumIds = [];
        for (let i = 0; i < count; i++) {
            forumIds.push(uuidv4());
        }
        return forumIds;
    }

    generatePolicyIds(count) {
        const policyIds = [];
        for (let i = 0; i < count; i++) {
            policyIds.push(uuidv4());
        }
        return policyIds;
    }

    generateServices() {
        // Mock services for counting user ownership
        return [
            { id: uuidv4(), title: 'Identity Verification Service', ownerId: null },
            { id: uuidv4(), title: 'Conflict Resolution Service', ownerId: null },
            { id: uuidv4(), title: 'Policy Template Service', ownerId: null },
            { id: uuidv4(), title: 'Community Moderation Service', ownerId: null }
        ];
    }

    generatePolicies() {
        // Mock policies for activity tracking
        return [
            { id: uuidv4(), title: 'Community Guidelines Policy', visibility: 'public' },
            { id: uuidv4(), title: 'Data Privacy Policy', visibility: 'public' },
            { id: uuidv4(), title: 'Governance Protocol Policy', visibility: 'public' }
        ];
    }

    generateForums() {
        // Mock forums for activity tracking
        return [
            { id: uuidv4(), title: 'General Discussion', policyId: uuidv4() },
            { id: uuidv4(), title: 'Policy Development', policyId: uuidv4() },
            { id: uuidv4(), title: 'Technical Support', policyId: uuidv4() }
        ];
    }

    // Get all public users with enhanced filtering
    async getPublicUsers(filters = {}) {
        let users = this.users.filter(user => user.isPublic);

        // Apply search filter
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            users = users.filter(user => 
                user.name.toLowerCase().includes(searchTerm) ||
                user.bio.toLowerCase().includes(searchTerm) ||
                user.email.toLowerCase().includes(searchTerm)
            );
        }

        // Apply category filters
        if (filters.category) {
            switch (filters.category) {
                case 'high-cert':
                    users = users.filter(user => user.certScore >= 70);
                    break;
                case 'active':
                    users = users.filter(user => {
                        const daysSinceActive = (Date.now() - new Date(user.lastActive)) / (1000 * 60 * 60 * 24);
                        return daysSinceActive <= 7;
                    });
                    break;
                case 'service-providers':
                    users = users.filter(user => user.services.length >= 1);
                    break;
                case 'highly-followed':
                    users = users.filter(user => user.followers.length >= 20);
                    break;
            }
        }

        // Apply sorting
        if (filters.sort) {
            switch (filters.sort) {
                case 'name':
                    users.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                case 'cert':
                    users.sort((a, b) => b.certScore - a.certScore);
                    break;
                case 'followers':
                    users.sort((a, b) => b.followers.length - a.followers.length);
                    break;
                case 'services':
                    users.sort((a, b) => b.services.length - a.services.length);
                    break;
                case 'recent':
                default:
                    users.sort((a, b) => new Date(b.lastActive) - new Date(a.lastActive));
                    break;
            }
        }

        // Apply pagination
        const page = parseInt(filters.page) || 1;
        const limit = parseInt(filters.limit) || 20;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        const paginatedUsers = users.slice(startIndex, endIndex);

        // Enhance user data for display
        const enhancedUsers = paginatedUsers.map(user => ({
            ...user,
            stats: {
                followers: user.followers.length,
                following: user.following.length,
                services: user.services.length,
                activities: user.activities.length,
                favourites: user.favourites.length
            }
        }));

        return {
            users: enhancedUsers,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(users.length / limit),
                totalUsers: users.length,
                hasNext: endIndex < users.length,
                hasPrev: page > 1
            }
        };
    }

    // Get user by ID with full details
    async getUserById(id) {
        const user = this.users.find(user => user.id === id && user.isPublic);
        if (!user) return null;

        // Get user's activities
        const userActivities = this.activities.filter(activity => activity.userId === id);
        
        return {
            ...user,
            stats: {
                followers: user.followers.length,
                following: user.following.length,
                services: user.services.length,
                activities: user.activities.length,
                favourites: user.favourites.length
            },
            recentActivities: userActivities.slice(0, 5) // Last 5 activities
        };
    }

    // Follow/unfollow user
    async toggleFollow(targetUserId, currentUserId) {
        const targetUser = this.users.find(u => u.id === targetUserId);
        const currentUser = this.users.find(u => u.id === currentUserId);

        if (!targetUser || !currentUser) {
            throw new Error('User not found');
        }

        const isFollowing = currentUser.following.includes(targetUserId);
        
        if (isFollowing) {
            // Unfollow
            currentUser.following = currentUser.following.filter(id => id !== targetUserId);
            targetUser.followers = targetUser.followers.filter(id => id !== currentUserId);
        } else {
            // Follow
            currentUser.following.push(targetUserId);
            targetUser.followers.push(currentUserId);
        }

        // Recalculate target user's CERT score (trust component affected)
        const cooperation = Math.floor(Math.random() * 100); // Would be calculated from actual data
        const engagement = Math.floor(Math.random() * 100);
        const retention = Math.floor(Math.random() * 100);
        
        targetUser.certScore = this.calculateCERTScore({
            cooperation,
            engagement,
            retention,
            trust: targetUser.followers.length
        });

        return { 
            success: true, 
            isFollowing: !isFollowing,
            newFollowerCount: targetUser.followers.length
        };
    }
}

const userService = new UserService();

// Routes

// GET /api/users/public - Get all public users
router.get('/public', async (req, res) => {
    try {
        const filters = {
            search: req.query.search,
            category: req.query.category,
            sort: req.query.sort,
            page: req.query.page,
            limit: req.query.limit
        };

        const result = await userService.getPublicUsers(filters);
        res.json(result);
    } catch (error) {
        console.error('Error fetching public users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// GET /api/users/:id - Get specific user
router.get('/:id', async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

// POST /api/users/:id/follow - Follow a user
router.post('/:id/follow', async (req, res) => {
    try {
        const currentUserId = req.user?.id || userService.users[0].id; // Mock current user
        const targetUserId = req.params.id;

        const result = await userService.toggleFollow(targetUserId, currentUserId);
        res.json(result);
    } catch (error) {
        console.error('Error following user:', error);
        res.status(500).json({ error: 'Failed to follow user' });
    }
});

// DELETE /api/users/:id/follow - Unfollow a user
router.delete('/:id/follow', async (req, res) => {
    try {
        const currentUserId = req.user?.id || userService.users[0].id; // Mock current user
        const targetUserId = req.params.id;

        const result = await userService.toggleFollow(targetUserId, currentUserId);
        res.json(result);
    } catch (error) {
        console.error('Error unfollowing user:', error);
        res.status(500).json({ error: 'Failed to unfollow user' });
    }
});

// GET /api/users/stats/summary - Get community statistics
router.get('/stats/summary', async (req, res) => {
    try {
        const { users } = await userService.getPublicUsers();
        
        const stats = {
            totalUsers: users.length,
            averageCertScore: Math.round(
                users.reduce((sum, user) => sum + user.certScore, 0) / users.length
            ),
            totalServices: users.reduce((sum, user) => sum + user.services.length, 0),
            totalFollowConnections: users.reduce((sum, user) => sum + user.followers.length, 0),
            activeUsers: users.filter(user => {
                const daysSinceActive = (Date.now() - new Date(user.lastActive)) / (1000 * 60 * 60 * 24);
                return daysSinceActive <= 7;
            }).length,
            averageActivities: Math.round(
                users.reduce((sum, user) => sum + user.activities.length, 0) / users.length
            )
        };

        res.json(stats);
    } catch (error) {
        console.error('Error fetching user stats:', error);
        res.status(500).json({ error: 'Failed to fetch user statistics' });
    }
});

module.exports = router;