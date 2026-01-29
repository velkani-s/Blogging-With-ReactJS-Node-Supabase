import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import axios from "axios";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("/api/blogPosts", {
          params: { search },
        });
        setBlogs(response.data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [search]);

  if (loading)
    return <div className="container mx-auto px-4 py-8">Loading...</div>;

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Helmet>
          <title>Blog Posts - Blog Site</title>
          <meta
            name="description"
            content="Read our comprehensive blog posts and expert reviews."
          />
        </Helmet>

        <h1 className="text-4xl font-bold text-gray-900 font-serif mb-8">
          Blog Posts
        </h1>

        {search && (
          <p className="text-gray-600 mb-6">
            Search results for: <strong>{search}</strong>
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <article
              key={blog._id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 font-serif mb-3">
                  <Link
                    to={`/blogs/${blog._id}`}
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {blog.title}
                  </Link>
                </h2>
                <p className="text-gray-600 text-sm mb-4">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </p>
                <p className="text-gray-700 line-clamp-3">
                  {blog.content.substring(0, 150)}...
                </p>
                <Link
                  to={`/blogs/${blog._id}`}
                  className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-medium"
                >
                  Read More →
                </Link>
              </div>
            </article>
          ))}
        </div>

        {blogs.length === 0 && (
          <p className="text-center text-gray-500 mt-8">No blog posts found.</p>
        )}
      </div>
    </div>
  );
};

export default BlogList;
