import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import BlogList from "./pages/BlogList";
import BlogPost from "./pages/BlogPost";
import ProductList from "./pages/ProductList";
import ProductPage from "./pages/ProductPage";
import AdminPanel from "./pages/AdminPanel";

function App() {
  return (
    <HelmetProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/blogs" element={<BlogList />} />
              <Route path="/blogs/:slug" element={<BlogPost />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/products/:slug" element={<ProductPage />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;
