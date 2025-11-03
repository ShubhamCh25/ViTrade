import React, { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      setMessage("✅ Logged in successfully!");
      window.location.href = "/dashboard";
    } catch (err) {
      console.error(err);
      setMessage("❌ Invalid credentials");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="backdrop-blur-xl bg-blue-500/20 border border-blue-400/30 shadow-2xl rounded-3xl p-10 w-full max-w-md">
        <div className="text-center mb-8">
         
          <h2 className="text-3xl font-bold text-blue-700 drop-shadow-sm">
            Welcome Back
          </h2>
          <p className="text-blue-500 mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white/80 placeholder-blue-400 text-blue-800 rounded-xl p-3.5 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/80 placeholder-blue-400 text-blue-800 rounded-xl p-3.5 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600/90 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-lg"
          >
            Log In
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-blue-200 text-center">
          <p className="text-sm text-blue-600">
            Don’t have an account?{" "}
            <a href="/signup" className="text-blue-800 hover:underline font-semibold">
              Sign up
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

export default Login;
