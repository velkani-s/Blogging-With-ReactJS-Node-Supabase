import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import api from "../utils/api";

const BlogPost = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await api.get(`/blog-posts/${slug}`);
        setBlog(response.data.data.post);
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  if (loading)
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  if (!blog)
    return (
      <div className="container mx-auto px-4 py-8">Blog post not found.</div>
    );

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Helmet>
          <title>{blog.title} - Blog Site</title>
          <meta name="description" content={blog.content.substring(0, 160)} />
        </Helmet>

        <article>
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 font-serif mb-4">
              {blog.title}
            </h1>
            <p className="text-gray-600 text-lg">
              Published on {new Date(blog.createdAt).toLocaleDateString()}
            </p>
          </header>

          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </article>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link
            to="/blogs"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Blog List
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
