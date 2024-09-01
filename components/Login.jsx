import Header from "./Header";
import { Link } from "react-router-dom";
// import SignUp from "./SignUp";
import { useState } from "react";
import axios from "axios";
// import Loader from "./Loader";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleApi = () => {
    if (!username || !password || !email) {
      alert("Please fill all the fields.");
      return;
  }

    // console.log({ username, password });
    const url = "http://localhost:4000/login";
    const data = { username, password ,email};
    axios
      .post(url, data)
      .then((res) => {
        console.log(res);
        if (res.data.message) {
          alert(res.data.message);
          if (res.data.token) {
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("userId", res.data.userId);
            localStorage.setItem("userName", res.data.username);
            navigate("/");
          }
        }
      })
      .catch((err) => {
        console.log(err);
        alert("SERVER ERROR");
      });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        margin: "50px auto", // Center the box horizontally
        width: "400px", // Set a fixed width for the box
        border: "1px solid #ddd",
        borderRadius: "5px",
        backgroundColor:  "#f8f9fa",
      }}
    >
      {/* <Loader /> */}
      {/* <Header /> */}
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Login</h2>
      <label htmlFor="username">USERNAME</label>
      <input
        type="text"
        id="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ width: "250px", padding: "10px", border: "1px solid #ccc", borderRadius: "3px", marginBottom: "10px" }}
      />
      <label htmlFor="email">EMAIL</label>
      <input
        type="text"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "250px", padding: "10px", border: "1px solid #ccc", borderRadius: "3px", marginBottom: "10px" }}
      />
      <label htmlFor="password">PASSWORD</label>
      <input
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "250px", padding: "10px", border: "1px solid #ccc", borderRadius: "3px", marginBottom: "20px" }}
      />

      <button onClick={handleApi} style={{ padding: "10px 20px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>
        LOGIN
      </button>
      <div style={{ marginTop: "10px", textAlign: "center" }}>
        Don't have an account? <Link to="/signup" style={{ textDecoration: "none", color: "#007bff" }}>Sign Up</Link>
      </div>
    </div>
  );
}

export default Login;
