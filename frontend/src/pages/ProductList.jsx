import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import api from "../utils/api";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading)
    return <div className="container mx-auto px-4 py-8">Loading...</div>;

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Helmet>
          <title>Products - Blog Site</title>
          <meta
            name="description"
            content="Browse our curated list of products with honest reviews."
          />
        </Helmet>

        <h1 className="text-4xl font-bold text-gray-900 font-serif mb-8">
          Products
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) =>(
            <div
              key={product.id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 font-serif mb-3">
                  <Link
                    to={`/products/${product.slug}`}
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {product.name}
                  </Link>
                </h2>
                <p className="text-gray-600 text-sm mb-4">${product.price}</p>
                <p className="text-gray-700 line-clamp-3">
                  {product.description}
                </p>
                <Link
                  to={`/products/${product.slug}`}
                  className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-medium"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <p className="text-center text-gray-500 mt-8">No products found.</p>
        )}
      </div>
    </div>
  );
};

export default ProductList;
