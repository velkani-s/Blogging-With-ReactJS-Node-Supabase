import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import api from "../utils/api";

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    categoryId: "",
    status: "published",
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await api.get("/blog-posts?limit=100");
      setBlogs(response.data.data.posts || []);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      alert("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/blog-posts");
      // Extract unique categories from blog posts if available
      setCategories([
        { id: "1", name: "Technology" },
        { id: "2", name: "Home & Garden" },
        { id: "3", name: "Sports & Outdoors" },
      ]);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    handleInputChange(e);
    if (!editingId) {
      setFormData((prev) => ({
        ...prev,
        slug: generateSlug(title),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update existing blog
        await api.put(`/blog-posts/${editingId}`, formData);
        alert("Blog updated successfully!");
      } else {
        // Create new blog
        await api.post("/blog-posts", formData);
        alert("Blog created successfully!");
      }
      resetForm();
      fetchBlogs();
    } catch (error) {
      console.error("Error saving blog:", error);
      alert("Failed to save blog: " + error.response?.data?.message || error.message);
    }
  };

  const handleEdit = (blog) => {
    setFormData({
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      excerpt: blog.excerpt,
      categoryId: blog.categoryId || "",
      status: blog.status || "published",
    });
    setEditingId(blog.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      try {
        await api.delete(`/blog-posts/${id}`);
        alert("Blog deleted successfully!");
        fetchBlogs();
      } catch (error) {
        console.error("Error deleting blog:", error);
        alert("Failed to delete blog");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      categoryId: "",
      status: "published",
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="bg-white min-h-screen">
      <Helmet>
        <title>Manage Blog Posts - Admin</title>
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 font-serif mb-8">
          Manage Blog Posts
        </h1>

        <button
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setShowForm(true);
            }
          }}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors mb-8"
        >
          {showForm ? "Cancel" : "Create New Blog Post"}
        </button>

        {showForm && (
          <div className="bg-gray-50 p-8 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingId ? "Edit Blog Post" : "Create New Blog Post"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleTitleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Enter blog title"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  Slug
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="URL-friendly slug"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  Excerpt
                </label>
                <input
                  type="text"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Short excerpt"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  Content
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                  rows="10"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Enter blog content (supports HTML)"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingId ? "Update Blog" : "Create Blog"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Title
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Slug
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Status
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Created
                </th>
                <th className="border border-gray-300 px-4 py-2 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {blogs.length > 0 ? (
                blogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">
                      {blog.title}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {blog.slug}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          blog.status === "published"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {blog.status}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <button
                        onClick={() => handleEdit(blog)}
                        className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(blog.slug)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="border border-gray-300 px-4 py-2 text-center">
                    No blog posts found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBlogs;
