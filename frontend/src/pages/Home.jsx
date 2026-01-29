import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-12">
        <Helmet>
          <title>Home - Blog Site</title>
          <meta
            name="description"
            content="Welcome to Blog Site - Your trusted source for honest product reviews and insightful blog posts."
          />
        </Helmet>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 font-serif mb-4">
            Welcome to Blog Site
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover honest reviews, expert insights, and the best products
            curated just for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800 font-serif mb-4">
              Latest Reviews
            </h2>
            <p className="text-gray-600 mb-4">
              Check out our most recent product reviews and comparisons.
            </p>
            <Link
              to="/blogs"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Read Reviews →
            </Link>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800 font-serif mb-4">
              Product Guides
            </h2>
            <p className="text-gray-600 mb-4">
              In-depth guides to help you make informed purchasing decisions.
            </p>
            <Link
              to="/products"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Browse Products →
            </Link>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800 font-serif mb-4">
              Expert Insights
            </h2>
            <p className="text-gray-600 mb-4">
              Stay updated with the latest trends and expert opinions.
            </p>
            <Link
              to="/blogs"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Explore Blogs →
            </Link>
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/blogs"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Start Exploring
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
