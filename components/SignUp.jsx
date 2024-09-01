import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './SignUp.css'; // Import the CSS file

function SignUp() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [contact, setContact] = useState('');
    const [email, setEmail] = useState('');

    const handleApi = () => {
        // console.log({ username: username, password: password });
        const url = 'http://localhost:4000/signup';
        const data = { username, password, contact, email };
        axios.post(url, data).then((res) => {
            console.log(res);
            if (res.data.message === 'THANKS FOR SIGNING UP') {
                alert(res.data.message);
                navigate('/');
            } else {
                alert(res.data.message);
            }
        })
        .catch((err) => {
            if (err.response && err.response.data && err.response.data.errors) {
                const errorMessages = err.response.data.errors.join('\n');
                alert(errorMessages);
            } else {
                alert('SERVER ERROR');
            }
        });
    };

    return (
        <div className="signup-container">
          <div className="signup-box">
            <h1>Welcome to CAMPUS-CART</h1>
            <input
              className="form-control"
              type="text"
              placeholder="USERNAME"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            <input
              className="form-control"
              type="text"
              placeholder="CONTACT NUMBER"
              value={contact}
              onChange={(e) => {
                setContact(e.target.value);
              }}
            />
            <input
              className="form-control"
              type="text"
              placeholder="EMAIL"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <input
              className="form-control"
              type="password"
              placeholder="PASSWORD"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <button className="signup-button" onClick={handleApi}>SIGNUP</button>
            <div>
              <p>
                Already have an account?
                <Link className="login-link" to="/login">Login</Link>
              </p>
            </div>
          </div>
        </div>
      );
      
}

export default SignUp;