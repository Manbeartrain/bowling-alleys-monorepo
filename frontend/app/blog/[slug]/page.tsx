import { getBlogPostBySlug, getAllBlogPosts } from "@/lib/blog-server";
import BlogPostPage from "@/components/pages/BlogPostPage";
import { notFound } from "next/navigation";

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = getBlogPostBySlug(params.slug);
  const allPosts = getAllBlogPosts();
  
  if (!post) {
    notFound();
  }
  
  return <BlogPostPage post={post} allPosts={allPosts} />;
}

