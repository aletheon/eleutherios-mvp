// src/app/types/forum.ts

export interface ForumStakeholder {
  userId: string;
  role: 'owner' | 'moderator' | 'member';
  permissions: {
    canAddMembers: boolean;
    canRemoveMembers: boolean;
    canCreateSubForums: boolean;
    canPost: boolean;
    canRemoveMessages: boolean;
    canUploadFiles: boolean;
    canRemoveFiles: boolean;
  };
  joinedAt: Date;
}

export interface ForumMessage {
  id: string;
  forumId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  attachments?: string[]; // URLs to uploaded files
  replyTo?: string; // ID of message being replied to
}

export interface Forum {
  id: string;
  name: string;
  description: string;
  policyId?: string; // If instantiated from a policy
  policyRuleName?: string; // Which rule instantiated this forum
  parentForumId?: string; // For sub-forums
  
  stakeholders: ForumStakeholder[];
  
  settings: {
    isPublic: boolean;
    requiresApproval: boolean; // New members need approval
    allowFileUploads: boolean;
    maxFileSize?: number; // in MB
    allowedFileTypes?: string[];
  };
  
  metadata: {
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    messageCount: number;
    fileCount: number;
    lastActivityAt?: Date;
  };
  
  status: 'active' | 'archived' | 'deleted';
}