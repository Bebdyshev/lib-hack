import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance, { updateAxiosToken } from "../../axios/instanse";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    try {
      const response = await axiosInstance.post("/auth/login", {email, password})

      localStorage.setItem("token", response.data.accessToken);
      updateAxiosToken(response.data.accessToken)
      localStorage.setItem("refresh", response.data.refreshToken)
      navigate("/"); 
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#edf2f7",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column-reverse",
          alignItems: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            backgroundColor: "#fff",
            width: "100%",
            maxWidth: "24rem",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            padding: "2rem",
            borderRadius: "0.5rem",
          }}
        >
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                <span>Email</span>
              </label>
              <input
                type="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "0.25rem",
                  border: "1px solid #e2e8f0",
                }}
                required
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                <span>Password</span>
              </label>
              <input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "0.25rem",
                  border: "1px solid #e2e8f0",
                }}
                required
              />
            </div>
            {error && (
              <div style={{ color: "red", marginBottom: "1rem" }}>
                {error}
              </div>
            )}
            <div style={{ marginTop: "1.5rem" }}>
              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  backgroundColor: "#3182ce",
                  color: "#fff",
                  borderRadius: "0.25rem",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Login
              </button>
              <label style={{ display: "flex", justifyContent: "center", marginTop: "0.5rem" }}>
                <a href="/register" style={{ fontSize: "0.875rem", color: "#4299e1" }}>
                  Don't have an account?
                </a>
              </label>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
