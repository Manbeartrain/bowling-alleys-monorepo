// Blog utilities for Next.js
// Uses API endpoints to fetch blog posts (no fs module needed for client-side)

import { api } from './api-client';

export interface BlogPost {
  slug: string;
  title: string;
  description?: string;
  author?: string;
  date?: string;
  updated?: string;
  category?: string;
  tags?: string[];
  image?: string;
  content?: string;
}

// Alias for compatibility
export const getBlogPosts = getAllBlogPosts;
export const getBlogPost = getBlogPostBySlug;

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const posts = await api.get('/api/blog');
    return posts || [];
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const post = await api.get(`/api/blog/${slug}`);
    return post || null;
  } catch (error) {
    console.error(`Error fetching blog post ${slug}:`, error);
    return null;
  }
}

export async function getBlogPostSlugs(): Promise<string[]> {
  try {
    const posts = await getAllBlogPosts();
    return posts.map((post) => post.slug);
  } catch (error) {
    console.error('Error fetching blog post slugs:', error);
    return [];
  }
}
