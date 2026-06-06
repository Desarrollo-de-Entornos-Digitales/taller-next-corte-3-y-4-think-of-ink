// User Profile Types
export interface UserProfile {
    id: string;
    name: string;
    username: string;
    email: string;
    profession?: string;
    bio?: string;
    location?: string;
    avatar?: string;
    website?: string;
    linkedin?: string;
    behance?: string;
    instagram?: string;
    portfolio?: string;
    totalPosts: number;
}

// Post Statistics
export interface PostStats {
    likes: number;
    comments: number;
}

// User Post
export interface UserPost {
    id: string;
    title: string;
    content: string;
    imageUrl?: string;
    location?: string;
    postType?: string;
    user: {
        id: string;
        username: string;
        avatar?: string;
        location?: string;
    };
    category?: {
        name: string;
    };
    stats: PostStats;
    likesCount?: number;
    commentsCount?: number;
    likedByUser?: boolean;
    createdAt: string;
}

export interface Comment {
    id: string;
    content: string;
    user: {
        id: string;
        username: string;
        avatar?: string;
    };
    createdAt: string;
}

// Response Type for Posts
export interface PostsResponse {
    data?: UserPost[];
    posts?: UserPost[];
    [key: string]: any;
}

// Notification Types
export interface Notification {
    id: string;
    username: string;
    action: string;
    target?: string;
    avatar: string;
    time: Date;
    read: boolean;
}

// Settings/Profile Form Types
export interface UserSettings {
    // Profile Information
    fullName: string;
    username: string;
    profession?: string;
    bio?: string;

    // Contact Information
    email?: string;
    website?: string;
    location?: string;

    // Social Media
    linkedin?: string;
    behance?: string;
    instagram?: string;
    portfolio?: string;

    // Avatar (base64 data URL)
    avatar?: string;
}
