import React, { useEffect, useState } from 'react';
import Header from './Header';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { PiUserCircle } from "react-icons/pi";

const MyProfile = () => {
    const [user, setUser] = useState({});
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        Contact_Number: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        let url = 'http://localhost:4000/my-profile/' + localStorage.getItem('userId');
        axios.get(url)
            .then((res) => {
                if (res.data.user) {
                    setUser(res.data.user);
                    setFormData({
                        username: res.data.user.username,
                        email: res.data.user.email,
                        Contact_Number: res.data.user.Contact_Number
                    });
                }
            })
            .catch((err) => {
                alert('Error fetching profile');
            });
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = 'http://localhost:4000/update-profile/' + localStorage.getItem('userId');
        axios.put(url, formData)
            .then((res) => {
                alert('Profile updated successfully');
                setUser(res.data.user);
            })
            .catch((err) => {
                alert('Error updating profile');
            });
    };

    return (
        <div>
            <Header />
            <div className="container mt-4">
                <div className="text-center"style={{ marginTop: '90px' }}>
                    <PiUserCircle size={120} className="user-icon mb-3" />
                </div>
                <h4 className="text-center mb-4">My Profile</h4>
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <form onSubmit={handleSubmit} className="profile-form">
                            <div className="form-group mb-3">
                                <label>Username:</label>
                                <input 
                                    type="text" 
                                    name="username" 
                                    value={formData.username} 
                                    onChange={handleChange} 
                                    className="form-control" 
                                    placeholder="Enter your username"
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label>Email:</label>
                                <input 
                                    type="email" 
                                    name="email" 
                                    value={formData.email} 
                                    onChange={handleChange} 
                                    className="form-control" 
                                    placeholder="Enter your email"
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label>Contact Number:</label>
                                <input 
                                    type="text" 
                                    name="Contact_Number" 
                                    value={formData.Contact_Number} 
                                    onChange={handleChange} 
                                    className="form-control" 
                                    placeholder="Enter your contact number"
                                />
                            </div>
                            <div className="text-center">
                                <button type="submit" className="btn btn-outline-success">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;
