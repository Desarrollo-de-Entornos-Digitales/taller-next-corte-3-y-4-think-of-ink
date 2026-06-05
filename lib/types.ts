// User Profile Types
export interface UserProfile {
    id: string;
    username: string;
    email: string;
    profession?: string;
    location?: string;
    avatar?: string;
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
    user: {
        id: string;
        username: string;
        avatar?: string;
    };
    category?: {
        name: string;
    };
    stats: PostStats;
    createdAt: string;
}

// Response Type for Posts
export interface PostsResponse {
    data?: UserPost[];
    posts?: UserPost[];
    [key: string]: any;
}
