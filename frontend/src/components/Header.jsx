import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";

const Header = () => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gray-800 font-serif">
          Blog Site
        </Link>
        <nav className="hidden md:flex space-x-6">
          <Link
            to="/"
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            Home
          </Link>
          <Link
            to="/blogs"
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            Blogs
          </Link>
          <Link
            to="/products"
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            Products
          </Link>
          <Link
            to="/admin"
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            Admin
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <SearchBar />
          <button
            className="md:hidden"
            onClick={() => {
              /* toggle mobile menu */
            }}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
