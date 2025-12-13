import { useState } from "react";
import { api } from "../api";
import "./Login.css"; // import CSS

export default function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isRegister) {
        await api.post("/auth/register", form);
      }

      const { data } = await api.post("/auth/login", {
        email: form.email,
        password: form.password,
      });

      onLogin(data.token, data.user);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card animate">
        <h2 className="title">{isRegister ? "Create Account" : "Welcome Back"}</h2>

        <form className="login-form" onSubmit={handleSubmit}>
          {isRegister && (
            <input
              type="text"
              className="input-box"
              placeholder="Full Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          )}

          <input
            type="email"
            className="input-box"
            placeholder="Email Address"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            className="input-box"
            placeholder="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="submit-btn">
            {isRegister ? "Register & Login" : "Login"}
          </button>
        </form>

        <button className="switch-btn" onClick={() => setIsRegister((v) => !v)}>
          {isRegister ? "Already have an account? Login →" : "New user? Register →"}
        </button>
      </div>
    </div>
  );
}
