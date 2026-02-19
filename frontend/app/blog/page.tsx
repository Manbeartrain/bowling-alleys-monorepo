import { getAllBlogPosts } from "@/lib/blog-server";
import BlogListPage from "@/components/pages/BlogListPage";

export default function Blog() {
  const posts = getAllBlogPosts();
  console.log(`Blog page: Loaded ${posts.length} posts`);
  return <BlogListPage initialPosts={posts} />;
}

