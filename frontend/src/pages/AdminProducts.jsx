import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import api from "../utils/api";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    originalPrice: "",
    brand: "",
    quantity: "",
    sku: "",
    status: "active",
    featured: false,
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products?limit=100");
      setProducts(response.data.data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      // Mock categories - you can expand this to fetch from backend
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
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    handleInputChange(e);
    if (!editingId) {
      setFormData((prev) => ({
        ...prev,
        slug: generateSlug(name),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: parseFloat(formData.originalPrice),
        quantity: parseInt(formData.quantity),
      };

      if (editingId) {
        // Update existing product
        await api.put(`/products/${editingId}`, payload);
        alert("Product updated successfully!");
      } else {
        // Create new product
        await api.post("/products", payload);
        alert("Product created successfully!");
      }
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      alert(
        "Failed to save product: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      brand: product.brand,
      quantity: product.quantity,
      sku: product.sku,
      status: product.status || "active",
      featured: product.featured || false,
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/products/${id}`);
        alert("Product deleted successfully!");
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      price: "",
      originalPrice: "",
      brand: "",
      quantity: "",
      sku: "",
      status: "active",
      featured: false,
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
        <title>Manage Products - Admin</title>
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 font-serif mb-8">
          Manage Products
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
          {showForm ? "Cancel" : "Create New Product"}
        </button>

        {showForm && (
          <div className="bg-gray-50 p-8 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingId ? "Edit Product" : "Create New Product"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleNameChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
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

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Brand
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Brand name"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    SKU
                  </label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="SKU"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Current price"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Original Price
                  </label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Original price"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Stock quantity"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <label className="block text-gray-700 font-semibold">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    Featured Product
                  </label>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Product description"
                />
              </div>

              <div className="mt-6 flex gap-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingId ? "Update Product" : "Create Product"}
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
                  Name
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  SKU
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Price
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Stock
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Status
                </th>
                <th className="border border-gray-300 px-4 py-2 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">
                      {product.name}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {product.sku}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      ${product.price}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {product.quantity}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          product.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <button
                        onClick={() => handleEdit(product)}
                        className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="border border-gray-300 px-4 py-2 text-center">
                    No products found
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

export default AdminProducts;
