import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const AdminPanel = () => {
  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Helmet>
          <title>Admin Panel - Blog Site</title>
          <meta
            name="description"
            content="Admin panel for managing blog posts and products."
          />
        </Helmet>

        <h1 className="text-4xl font-bold text-gray-900 font-serif mb-8">
          Admin Panel
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800 font-serif mb-4">
              Manage Blog Posts
            </h2>
            <p className="text-gray-600 mb-4">
              Create, edit, and delete blog posts.
            </p>
            <Link
              to="/admin/blogs"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Manage Blogs
            </Link>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800 font-serif mb-4">
              Manage Products
            </h2>
            <p className="text-gray-600 mb-4">
              Add, update, and remove products.
            </p>
            <Link
              to="/admin/products"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Manage Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
