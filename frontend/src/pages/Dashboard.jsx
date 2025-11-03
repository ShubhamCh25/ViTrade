import React, { useEffect, useState } from "react";
import api from "../api/axios";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [price, setPrice] = useState("");
  const [comment, setComment] = useState("");
  const [category,setCategory]=useState("All");
  const categories = [
    "Electronics",
    "Books & Notes",
    "Clothing & Accessories",
    "Hostel Essentials",
    "Laptops & Peripherals",
    "Gaming & Entertainment",
    "Miscellaneous"
  ];
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setCurrentUserId(JSON.parse(savedUser).id);

    api
      .get("/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Failed to fetch products:", err));
  }, []);

  const filteredProducts = products.filter((p) =>{

  if(p.sellerId !== currentUserId && category=='All'){
    console.log(p.category)
    return true;
  }
  else if(category!='All' && p.category==category){
    return true;
  }
  });
  const openOrderPopup = (product) => {
    setSelectedProduct(product);
    setPrice(product.price);
    setComment("");
  };

  const closePopup = () => {
    setSelectedProduct(null);
  };

  const submitOrder = async () => {
    try {
      const res = await api.post("/requests", {
        productId: selectedProduct._id,
        offeredPrice: price,
        comment,
      });
      alert(res.data.message);
      closePopup();
    } catch (err) {
      alert(err.response?.data?.message || "Order failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 text-center flex justify-between">
         
        <div className="flex justify-center items-center mt-10">
  <div className="bg-white shadow-md border border-gray-200 rounded-xl p-5 w-[300px] text-center">
    <h1 className="text-2xl font-semibold text-blue-500">
      Available Products
    </h1>
  </div>
</div>

          <div>
            
          <div className="flex justify-center items-center mt-8">
  <div className="bg-white shadow-md border border-gray-200 rounded-xl p-4 w-[250px]">
    <label className="block text-gray-700 font-medium mb-2 text-center">
      Filter by Category
    </label>
    <select
      onChange={(e) => setCategory(e.target.value)}
      className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="All">All</option>
      {categories.map((ele, idx) => (
        <option key={idx} value={ele}>
          {ele}
        </option>
      ))}
    </select>
  </div>
</div>

        </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-card rounded-2xl shadow-lg p-12 text-center border border-border">
            <div className="text-6xl mb-4 opacity-30">📦</div>
            <p className="text-muted-foreground text-lg">
              No products available right now
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((p) => (
              <ProductCard
                key={p._id}
                product={p}
                openOrderPopup={() => openOrderPopup(p)}
              />
            ))}
          </div>
        )}
     
      </div>


      {selectedProduct && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
          onClick={closePopup}
        >
          <div
            className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl w-full max-w-md relative animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-2xl mb-6 text-center text-foreground">
              Confirm Order
            </h3>

            <input
              type="number"
              placeholder="Offered Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="border border-input bg-background text-foreground rounded-lg p-3 w-full mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <textarea
              placeholder="Add a comment (optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="border border-input bg-background text-foreground rounded-lg p-3 w-full min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>

            <div className="flex gap-3 mt-6">
              <button
                onClick={submitOrder}
                className="bg-primary hover:bg-primary/90 text-white font-medium px-6 py-2.5 rounded-lg flex-1 transition-all duration-200"
              >
                Submit
              </button>
              <button
                onClick={closePopup}
                className="bg-gray-400 hover:bg-gray-500 text-white font-medium px-6 py-2.5 rounded-lg flex-1 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ProductCard = ({ product }) => {
  const [index, setIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [price, setPrice] = useState(product.price);
  const [comment, setComment] = useState("");
  const images = product.images || [];

  const prev = () => setIndex((index - 1 + images.length) % images.length);
  const next = () => setIndex((index + 1) % images.length);

  const addToCart = async () => {
    try {
      const res = await api.post("/cart/add", { productId: product._id });
      alert(res.data.message || "Added to cart!");
    } catch (err) {
      alert(err.response?.data?.message || "Error adding to cart");
    }
  };

  const handleOrder = () => {
    if (confirm("Are you sure you want to order this product?")) {
      setShowPopup(true);
    }
  };
 
  const submitOrder = async () => {
    try {
      const res = await api.post("/requests", {
        productId: product._id,
        offeredPrice: price,
        comment,
      });
      alert(res.data.message);
      setShowPopup(false);
    } catch (err) {
      alert(err.response?.data?.message || "Order failed");
    }
  };

  return (
    <div className="group relative bg-card rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-border hover:border-primary/30 hover:-translate-y-1">
     
      <div className="relative overflow-hidden">
        {images.length > 0 ? (
          <img
            src={images[index]}
            alt={product.name}
            className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-56 bg-muted flex items-center justify-center">
            <span className="text-muted-foreground text-4xl opacity-50">📷</span>
          </div>
        )}

        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm text-foreground hover:bg-background transition-all p-2 rounded-full border border-border"
            >
              ◀
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm text-foreground hover:bg-background transition-all p-2 rounded-full border border-border"
            >
              ▶
            </button>
          </>
        )}
      </div>

      {/* Product Info */}
      <div className="p-5">
        <h3 className="font-bold text-xl text-foreground mb-1">{product.name}</h3>
        <p className="text-sm text-muted-foreground inline-flex items-center gap-1 mb-2">
          <span className="w-2 h-2 rounded-full bg-primary/50"></span>
          {product.category}
        </p>
        <p className="text-sm text-muted-foreground">
          Seller: <span className="text-primary font-medium">{product.sellerUsername}</span>
        </p>

        <div className="flex flex-col gap-2.5 mt-5">
          <button
            onClick={addToCart}
            className="bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium py-2.5 rounded-lg transition-all duration-200 border border-border hover:border-primary/30"
          >
            Add to Cart
          </button>
          <button
            onClick={handleOrder}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 rounded-lg transition-all duration-200"
          >
            Order Now
          </button>
        </div>
      </div>

      {/* 🧊 Glass Confirm Order Popup */}
      {showPopup && (
        <div className="absolute inset-0 flex justify-center items-center bg-white/10 backdrop-blur-md z-20 animate-fadeIn">
          <div
            className="w-11/12 max-w-sm bg-white/30 dark:bg-gray-800/40 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-2xl p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Confirm Order
            </h3>

            <input
              type="number"
              placeholder="Offered Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-2 mb-3 rounded-lg border border-gray-300 bg-white/50 dark:bg-gray-700/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <textarea
              placeholder="Add a comment (optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-2 rounded-lg border border-gray-300 bg-white/50 dark:bg-gray-700/40 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
            ></textarea>

            <div className="flex justify-center gap-3 mt-5">
              <button
                onClick={submitOrder}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-all"
              >
                Submit
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-5 py-2 rounded-lg font-medium transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default Dashboard;
