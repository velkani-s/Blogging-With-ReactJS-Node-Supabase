const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Blog Site</h3>
            <p className="text-gray-300">
              Your source for honest reviews and product insights.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-300 hover:text-white">
                  Home
                </a>
              </li>
              <li>
                <a href="/blogs" className="text-gray-300 hover:text-white">
                  Blogs
                </a>
              </li>
              <li>
                <a href="/products" className="text-gray-300 hover:text-white">
                  Products
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-gray-300">Email: info@blogsite.com</p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-300">
            &copy; 2023 Blog Site. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Affiliate Disclosure: This site may contain affiliate links. We may
            earn a commission from purchases made through these links at no
            additional cost to you.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
