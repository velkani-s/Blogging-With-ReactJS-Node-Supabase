import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import api from "../utils/api";

const ProductPage = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${slug}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading)
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  if (!product)
    return (
      <div className="container mx-auto px-4 py-8">Product not found.</div>
    );

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Helmet>
          <title>{product.name} - Blog Site</title>
          <meta name="description" content={product.description} />
        </Helmet>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <img
              src={product.image || "/placeholder.jpg"}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg shadow-md"
            />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 font-serif mb-4">
              {product.name}
            </h1>
            <p className="text-2xl text-blue-600 font-semibold mb-4">
              ${product.price}
            </p>
            <p className="text-gray-700 mb-6">{product.description}</p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Buy Now
            </button>
            <p className="text-sm text-gray-500 mt-4">
              * Affiliate link - We may earn a commission from purchases made
              through this link.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link
            to="/products"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
