import './Header.css';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import { FaHome } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { BiSolidUserDetail } from "react-icons/bi";

function Header(props) {
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/login');
    };

    return (
        <div className='container-fluid'>
            <nav className='navbar navbar-expand-lg navbar-dark'>
                <div className='container'>
                    <Link to="/" className='navbar-brand'>
                        <FaHome style={{ fontSize: '2rem' }} />
                    </Link>
                    <div className='d-flex align-items-center me-5'>
                        <input
                            type="text"
                            className='form-control me-1 custom-search-input'
                            placeholder='Find Cycle, Books, Mattress etc'
                            value={props.search || ''}
                            onChange={(e) => props.handleSearch && props.handleSearch(e.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    props.handleClick && props.handleClick();
                                }
                            }}
                        />
                        <button
                            className='btn btn-light circular-btn'
                            onClick={() => props.handleClick && props.handleClick()}
                        >
                            🔍
                        </button>
                    </div>
                    <div className='ms-auto d-flex align-items-center'>
                        {localStorage.getItem('token') ? (
                            <>
                                <Link to="/add-product" className='btn btn-light me-2'>
                                    ADD PRODUCT
                                </Link>
                                <Link to="/my-products" className='btn btn-light me-2'>
                                    MY PRODUCTS
                                </Link>
                                <button
                                    className='btn btn-light btn-user-detail'
                                    onClick={() => setShowDropdown(!showDropdown)}
                                >
                                    <BiSolidUserDetail style={{ fontSize: '1.5rem' }} />
                                </button>
                                {showDropdown && (
                                    <div className='dropdown-menu show'>
                                        <Link to="/liked-products" className='dropdown-item'>LIKED PRODUCTS</Link>
                                        <Link to="/my-profile" className='dropdown-item'>MY PROFILE</Link>
                                        <button
                                            className='dropdown-item text-danger'
                                            onClick={() => {
                                                if (window.confirm('YOU WILL BE LOGGED OUT')) {
                                                    handleLogout();
                                                }
                                            }}
                                        >
                                            <MdLogout /> LOGOUT
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <Link to="/login" className='btn btn-light'>
                                LOGIN
                            </Link>
                        )}
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Header;
