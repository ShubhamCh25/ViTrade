import React, { useState } from "react";
import api from "../api/axios";

const UploadProduct = () => {
  const [form, setForm] = useState({
    category: "",
    name: "",
    price: "",
    description: "",
  });
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState("");

  const categories = [
    "Electronics",
    "Books & Notes",
    "Clothing & Accessories",
    "Hostel Essentials",
    "Laptops & Peripherals",
    "Gaming & Entertainment",
    "Miscellaneous"
  ];
  

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (images.length < 3) {
        alert("Please upload at least 3 images");
        return;
      }

      const data = new FormData();
      Object.entries(form).forEach(([key, value]) =>
        data.append(key, value)
      );
      images.forEach((img) => data.append("images", img));

      const res = await api.post("/products/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage(res.data.message);
      setForm({ category: "", name: "", price: "", description: "" });
      setImages([]);
    } catch (err) {
      console.error(err);
      setMessage(" Upload failed");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-blue-200 shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-center ">Upload Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4 ">
        
        {/* ✅ CATEGORY DROPDOWN */}
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="border p-2 w-full rounded bg-gray-50"
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <input
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />
        <input
          name="price"
          placeholder="Price"
          type="number"
          value={form.price}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="border p-2 w-full rounded"
          required
        />
        
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
        >
          Upload
        </button>
      </form>
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
};

export default UploadProduct;
