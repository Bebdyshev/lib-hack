import React, { useState } from "react";
import axiosInstance,{updateAxiosToken} from "../../axios/instanse";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState(false); 
  const [error, setError] = useState("");

  const navigate = useNavigate();


  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    try {
      const response = await axiosInstance.post("/auth/register", {
        full_name: fullName,
        phone_number: phoneNumber,
        email,
        password,
        gender
      })

      const loginResponse = await axiosInstance.post("/auth/login", {email, password})

      localStorage.setItem("token", loginResponse.data.accessToken);
      updateAxiosToken(loginResponse.data.accessToken)

      localStorage.setItem("refresh", loginResponse.data.refreshToken)
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
                <span>Full name</span>
              </label>
              <input
                type="text"
                placeholder="full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
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
                <span>Phone number</span>
              </label>
              <input
                type="tel"
                placeholder="phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
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
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                <span>Gender</span>
              </label>
              <div style={{ display: "flex", gap: "1rem" }}>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="true"
                    checked={gender === "true"}
                    onChange={(e) => setGender(e.target.value)}
                  />
                  Male
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="false"
                    checked={gender === "false"}
                    onChange={(e) => setGender(e.target.value)}
                  />
                  Female
                </label>

              </div>
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
                Sign up
              </button>
              <label style={{ display: "flex", justifyContent: "center", marginTop: "0.5rem" }}>
                <a href="/login" style={{ fontSize: "0.875rem", color: "#4299e1" }}>
                  Already have an account?
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
