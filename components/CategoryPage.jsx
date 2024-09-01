import { useEffect, useState } from "react";
import Header from "./Header.jsx";
import { useParams } from "react-router-dom";
import axios from "axios";
import Category from "./Categories.jsx";
import { IoHeart } from "react-icons/io5";
import './Home.css';
import { useNavigate } from "react-router-dom";

function CategoryPage() {
    const navigate = useNavigate();
    const param = useParams();
    console.log(param.catName);

    const [products, setProduct] = useState([]);
    const [cproducts, setcProduct] = useState([]);
    const [search, setSearch] = useState('');
    const [issearch, setisSearch] = useState(false);

    useEffect(() => {
        const url = 'http://localhost:4000/get-product?catName=' + param.catName;
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
    }, [param]);

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

    const handleCategory = (value) => {
        let filteredProducts = products.filter((item) => item.pcat === value);
        setcProduct(filteredProducts);
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

    return (
        <div >
            <Header search={search} handleSearch={handleSearch} handleClick={handleClick} />
            <Category handleCategory={handleCategory} />
            {issearch && cproducts && 
                <h2 style={{ marginTop: '100px' }}>
                    RESULTS FOR YOU
                    <button className="clear-btn" onClick={() => setisSearch(false)}>CLEAR</button>
                </h2>}
            {issearch && cproducts && cproducts.length === 0 && <h2>NOT AVAILABLE</h2>}
            {issearch && <div className="d-flex justify-content-center flex-wrap"style={{ marginTop: '40px', marginLeft: '200px' }}>
                {cproducts && cproducts.length > 0 &&
                    cproducts.map((item) => (
                        <div onClick={() => handleProduct(item._id)} key={item._id} className="card mt-3">
                            <div className="icon-cont">
                                <IoHeart onClick={() => handleLike(item._id)} className="icons" />
                            </div>
                            <img width="250px" height="150px" src={'http://localhost:4000/' + item.pimg1} alt={item.pname} />
                            <p className="m-2">{item.pname} | {item.pcat}</p>
                            <p className="m-2 text-dark">{item.pdesc}</p>
                            <p className="m-2 price-text">Rs.{item.pprice}/-</p>
                        </div>
                    ))}
            </div>}
            {!issearch && <div className="d-flex justify-content-center flex-wrap "style={{ marginTop: '100px', marginLeft: '200px' }}>
                {products && products.length > 0 &&
                    products.map((item) => (
                        <div onClick={() => handleProduct(item._id)} key={item._id} className="card mt-3">
                            <img width="250px" height="150px" src={'http://localhost:4000/' + item.pimg1} alt={item.pname} />
                            <p className="m-2">{item.pname} | {item.pcat}</p>
                            <p className="m-2 text-dark">{item.pdesc}</p>
                            <p className="m-2 price-text">Rs.{item.pprice}/-</p>
                        </div>
                    ))}
            </div>}
        </div>
    )
}

export default CategoryPage;
