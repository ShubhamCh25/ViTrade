import React, { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const Signup = () => {
  const { signup } = useContext(AuthContext);
  const [form, setForm] = useState({
    username: "",
    password: "",
    vitmail: "",
    vitReg: "",
    phone: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(form);
      setMessage("Signup successful! Redirecting...");
      setTimeout(() => (window.location.href = "/"), 1000);
    } catch (err) {
      console.error(err);
      setMessage(" Signup failed. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="backdrop-blur-xl bg-blue-500/20 border border-blue-400/30 shadow-2xl rounded-3xl p-10 w-full max-w-md">
        <div className="text-center mb-8">
       
          <h2 className="text-3xl font-bold text-blue-700 drop-shadow-sm">
            Join ViTrade
          </h2>
          <p className="text-blue-500 mt-2">Create your account to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="w-full bg-white/80 placeholder-blue-400 text-blue-800 rounded-xl p-3.5 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            required
          />
          <input
            type="email"
            name="vitmail"
            placeholder="VIT Mail (e.g. abc@vit.edu)"
            value={form.vitmail}
            onChange={handleChange}
            className="w-full bg-white/80 placeholder-blue-400 text-blue-800 rounded-xl p-3.5 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            required
          />
          <input
            type="text"
            name="vitReg"
            placeholder="VIT Registration Number"
            value={form.vitReg}
            onChange={handleChange}
            className="w-full bg-white/80 placeholder-blue-400 text-blue-800 rounded-xl p-3.5 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="w-full bg-white/80 placeholder-blue-400 text-blue-800 rounded-xl p-3.5 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full bg-white/80 placeholder-blue-400 text-blue-800 rounded-xl p-3.5 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600/90 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-lg"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-blue-200 text-center">
          <p className="text-sm text-blue-600">
            Already have an account?{" "}
            <a href="/login" className="text-blue-800 hover:underline font-semibold">
              Log in
            </a>
          </p>
        </div>

        {message && (
          <div
            className={`mt-4 text-center text-sm p-3 rounded-lg ${
              message.includes("✅")
                ? "bg-green-400/10 text-green-700 border border-green-300/30"
                : "bg-red-400/10 text-red-700 border border-red-300/30"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;
