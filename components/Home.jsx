import { useEffect, useState } from "react";
import Header from "./Header";
import axios from "axios";
import Categories from "./Categories.jsx";
import { IoHeart } from "react-icons/io5";
import './Home.css'
import { useNavigate } from "react-router-dom";

function Home() {
    const [products, setProduct] = useState([]);
    const [likedproducts, setlikedProduct] = useState([]);
    const [cproducts, setcProduct] = useState([]);
    const [caproducts, setcaProduct] = useState([]);
    const [search, setSearch] = useState('');
    const [issearch, setisSearch] = useState(false);

    useEffect(() => {
        const url = 'http://localhost:4000/get-product';
        axios.get(url)
            .then((res) => {
                if (res.data.products) {
                    setProduct(res.data.products);
                }
            })
            .catch((err) => {
                console.log(err);
                alert('SERVER ERROR');
            });

        const url2 = 'http://localhost:4000/liked-product';
        let data = { userId: localStorage.getItem('userId') };
        axios.post(url2, data)
            .then((res) => {
                if (res.data.products) {
                    setlikedProduct(res.data.products);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const handleSearch = (value) => {
        setSearch(value);
    }

    const handleClick = () => {
        const url = 'http://localhost:4000/search?search=' + search;
        axios.get(url)
            .then((res) => {
                setcProduct(res.data.products);
                setisSearch(true);
            })
            .catch((err) => {
                console.log(err);
                alert('SERVER ERROR');
            });
    }

    const navigate = useNavigate();

    const handleCategory = (value) => {
        let filteredProducts = products.filter((item) => item.pcat === value);
        setcaProduct(filteredProducts);
    }

    const handleLike = (productId) => {
        let userId = localStorage.getItem('userId');
        if (!userId) {
            alert('PLEASE LOGIN FIRST');
            return;
        }
        const url = 'http://localhost:4000/liked-product';
        const data = { userId, productId };
        axios.post(url, data)
            .then((res) => {
                if (res.data.message) {
                    alert('Product liked');
                    navigate('/');
                }
            })
            .catch((err) => {
                console.log(err);
                alert('SERVER ERROR');
            });
    }

    const handleProduct = (id) => {
        navigate('/product/' + id);
    }

    const handleDisLike = (productId) => {
        let userId = localStorage.getItem('userId');
        if (!userId) {
            alert('PLEASE LOGIN FIRST');
            return;
        }
        const url = 'http://localhost:4000/disliked-product';
        const data = { userId, productId };
        axios.post(url, data)
            .then((res) => {
                if (res.data.message) {
                    alert('Product Unliked');
                    navigate('/');
                }
            })
            .catch((err) => {
                console.log(err);
                alert('SERVER ERROR');
            });
    }

    return (
        <div style={{ marginTop: '100px' }}>
            <Header search={search} handleSearch={handleSearch} handleClick={handleClick} />
            <Categories handleCategory={handleCategory} />
            {issearch && cproducts && 
            <h2 className="d-flex justify-content-center flex-wrap">
                RESULTS FOR YOU
                <button className="clear-btn" onClick={() => { setisSearch(false); setSearch(''); }}>CLEAR</button>
            </h2>}
            {issearch && cproducts && cproducts.length === 0 && <h2 className="d-flex justify-content-center flex-wrap"style={{ marginTop: '100px',marginLeft:'20px' }}>NOTHING AVAILABLE</h2>}
            {issearch && 
            <div className="d-flex justify-content-center flex-wrap" style={{marginLeft:'100px' }}>
                {cproducts && cproducts.length > 0 &&
                    cproducts.map((item, index) => (
                        <div onClick={() => handleProduct(item._id)} key={item._id} className="card mt-3"style={{ marginTop: '100px',marginLeft:'20px' }}>
                            <img width="250px" height="150px" src={'http://localhost:4000/' + item.pimg1} alt={item.pname} />
                            <p className="m-2">{item.pname} | {item.pcat}</p>
                            <p className="m-2 text-dark">{item.pdesc}</p>
                            <p className="m-2 price-text">Rs.{item.pprice}/-</p>
                        </div>
                    ))
                }
            </div>}
            {!issearch && 
            <div className="main-content d-flex justify-content-center flex-wrap">
                {products && products.length > 0 &&
                    products.map((item, index) => (
                        <div onClick={() => handleProduct(item._id)} key={item._id} className="card mt-3">
                            <div className="icon-cont">
                                {likedproducts.find((likedItem) => likedItem._id === item._id) ?
                                    <IoHeart onClick={() => handleDisLike(item._id)} className="red-icons" /> :
                                    <IoHeart onClick={() => handleLike(item._id)} className="icons" />}
                            </div>
                            <img width="250px" height="150px" src={'http://localhost:4000/' + item.pimg1} alt={item.pname} />
                            <p className="m-2">{item.pname} | {item.pcat}</p>
                            <p className="m-2 text-dark">{item.pdesc}</p>
                            <p className="m-2 price-text">Rs.{item.pprice}/-</p>
                        </div>
                    ))
                }
            </div>}
        </div>
    );
}

export default Home;
