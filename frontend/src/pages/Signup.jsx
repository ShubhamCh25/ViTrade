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
      setMessage("✅ Signup successful! Redirecting...");
      setTimeout(() => (window.location.href = "/"), 1000);
    } catch (err) {
      console.error(err);
      setMessage("❌ Signup failed. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-accent/10 to-background p-4">
      <div className="bg-card shadow-2xl rounded-3xl p-8 w-full max-w-md border border-border">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">✨</div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Join ViTrade
          </h2>
          <p className="text-muted-foreground mt-2">Create your account to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="w-full border border-input bg-background text-foreground rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            required
          />
          <input
            type="email"
            name="vitmail"
            placeholder="VIT Mail (e.g. abc@vit.edu)"
            value={form.vitmail}
            onChange={handleChange}
            className="w-full border border-input bg-background text-foreground rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            required
          />
          <input
            type="text"
            name="vitReg"
            placeholder="VIT Registration Number"
            value={form.vitReg}
            onChange={handleChange}
            className="w-full border border-input bg-background text-foreground rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="w-full border border-input bg-background text-foreground rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full border border-input bg-background text-foreground rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            required
          />
          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <a href="/login" className="text-primary hover:underline font-semibold">
              Log in
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

export default Signup;
