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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-accent/10 to-background p-4">
      <div className="bg-card shadow-2xl rounded-3xl p-8 w-full max-w-md border border-border">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">👋</div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="text-muted-foreground mt-2">Sign in to your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-input bg-background text-foreground rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-input bg-background text-foreground rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Log In
          </button>
        </form>
        
        <div className="mt-6 pt-6 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <a href="/signup" className="text-primary hover:underline font-semibold">
              Sign up
            </a>
          </p>
        </div>
        
        {message && (
          <div className={`mt-4 text-center text-sm p-3 rounded-lg ${
            message.includes("✅") 
              ? "bg-primary/10 text-primary border border-primary/20" 
              : "bg-destructive/10 text-destructive border border-destructive/20"
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
