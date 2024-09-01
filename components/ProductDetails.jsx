import React, { useEffect, useState } from "react";
import {useParams } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import io from 'socket.io-client'
let socket;
function ProductDetail() {
    const [product, setProduct] = useState(null);
    const [user, setUser] = useState(null);
    const [msg, setmsg] = useState('');
    const[msgs,setmsgs] = useState([])//jo already hai vo dikhane ke liye
    const p = useParams();

   
   useEffect(()=>{
        socket = io('http://localhost:4000');
        socket.on('connect',()=>{
            console.log('hua kya?')
        })

        
   },[])
   useEffect(()=>{
    socket.on('getmsg',(data)=>{
        const _data = data.filter((item, index) => {
            return item.productId == p.productId
        })
        console.log(data,"kuch mila");
        setmsgs(_data);
    })
   },[p.productId])
    
   const handlesend = ()=>{
        const data = {username:localStorage.getItem('userName'),msg,productId:product._id}
        socket.emit('sendmsg',data);
        setmsg('')
   }
    useEffect(() => {
        const url = 'http://localhost:4000/product/' + p.productId;
        axios.get(url)
            .then((res) => {
                if (res.data.product) {
                    setProduct(res.data.product);
                }
            })
            .catch((err) => {
                console.log(err);
                alert('SERVER ERROR');
            });
    }, [p]);

    const handleContact = (addedBy) => {
        const url = 'http://localhost:4000/get-user/' + addedBy;
        axios.get(url)
            .then((res) => {
                if (res.data.user) {
                    setUser(res.data.user);
                }
            })
            .catch((err) => {
                console.log(err);
                alert('SERVER ERROR');
            });
    };

    return (
        <>
            {/* <Header /> */}
            <div style={styles.container}>
                <h2 style={styles.title}>Product Details</h2>
                {product && (
                    <div style={styles.productContainer}>
                        <div style={styles.imageContainer}>
                            <img
                                src={'http://localhost:4000/' + product.pimg1}
                                alt="Product"
                                style={styles.image}
                            />
                            {product.pimg2 && (
                                <img
                                    src={'http://localhost:4000/' + product.pimg2}
                                    alt="Product"
                                    style={styles.image}
                                />
                            )}
                        </div>
                        <div style={styles.infoContainer}>
                            <h3 style={styles.sectionTitle}>About the Product</h3>
                            <div style={styles.infoBlock}>
                                <h4 style={styles.label}>Name:</h4>
                                <p style={styles.infoText}>{product.pname}</p>
                            </div>
                            <div style={styles.infoBlock}>
                                <h4 style={styles.label}>Description:</h4>
                                <p style={styles.infoText}>{product.pdesc}</p>
                            </div>
                            <div style={styles.infoBlock}>
                                <h4 style={styles.label}>Price:</h4>
                                <p style={styles.price}>Rs. {product.pprice}/-</p>
                            </div>
                            {localStorage.getItem('token') && (
                                <>
                                    {product.addedBy && (
                                        <button
                                            onClick={() => handleContact(product.addedBy)}
                                            style={styles.button}
                                        >
                                            Show Contact Details
                                        </button>
                                    )}
                                    {user && (
                                        <div style={styles.contactDetails}>
                                            <div style={styles.infoBlock}>
                                                <h4 style={styles.label}>Seller Name:</h4>
                                                <p style={styles.infoText}>{user.username}</p>
                                            </div>
                                            <div style={styles.infoBlock}>
                                                <h4 style={styles.label}>Email:</h4>
                                                <p style={styles.infoText}>{user.email}</p>
                                            </div>
                                            <div style={styles.infoBlock}>
                                                <h4 style={styles.label}>Contact Number:</h4>
                                                <p style={styles.infoText}>{user.Contact_Number}</p>
                                            </div>
                                        </div>
                                    )}
                                   <div>                                                                        
                                        {
                                            (msgs && msgs.length > 0) &&
                                            msgs.map((item, index) => {
                                                if (item.username === localStorage.getItem('userName')) {
                                                    return (
                                                        <p key={item._id} style={{ 
                                                            color: '#fff', margin: '10px 0 10px auto', background: '#61dafb', borderRadius: '10px', padding: '10px', maxWidth: '60%', textAlign: 'left'
                                                        }}>
                                                            {"Me"} : {item.msg} 
                                                        </p>
                                                    )
                                                }
                                                if (item.username !== localStorage.getItem('userName')) {
                                                    return (
                                                        <p key={item._id} style={{ 
                                                            color: '#fff',  margin: '10px auto 10px 0', 
                                                            background: '#282c34',  borderRadius: '10px', 
                                                            padding: '10px', maxWidth: '60%', textAlign: 'left'
                                                        }}>
                                                            {item.username} : {item.msg} 
                                                        </p>
                                                    )
                                                }
                                            })
                                        }
                                        <input 
                                            placeholder="Enter your message" 
                                            value={msg} 
                                            onChange={(e) => {
                                                setmsg(e.target.value)
                                            }} 
                                            className="form-control" 
                                            type="text" 
                                            style={{
                                                width: 'calc(100% - 100px)', 
                                                padding: '10px', 
                                                margin: '10px 10px 10px 0', 
                                                borderRadius: '5px', 
                                                border: '1px solid #ccc'
                                            }} 
                                        />
                                        <button 
                                            onClick={handlesend} 
                                            className="btn btn-primary" 
                                            style={{
                                                padding: '10px 20px', 
                                                margin: '10px 0', 
                                                borderRadius: '5px', 
                                                backgroundColor: '#007bff', 
                                                border: 'none', 
                                                color: '#fff', 
                                                cursor: 'pointer'
                                            }}
                                        >
                                            SEND
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

const styles = {
    container: {
        padding: '20px',
        maxWidth: '900px',
        margin: 'auto',
        backgroundColor: '#f0f4f8',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        fontFamily: 'Arial, sans-serif',
    },
    title: {
        textAlign: 'center',
        marginBottom: '20px',
        color: '#2c3e50',
        fontSize: '28px',
        fontWeight: 'bold',
    },
    productContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    imageContainer: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginBottom: '20px',
    },
    image: {
        width: '450px',
        height: '350px',
        margin: '10px',
        border: '1px solid #ddd',
        borderRadius: '10px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    infoContainer: {
        width: '100%',
        padding: '20px',
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    sectionTitle: {
        color: '#34495e',
        fontSize: '22px',
        fontWeight: 'bold',
        marginBottom: '10px',
    },
    infoBlock: {
        marginBottom: '10px',
    },
    label: {
        fontWeight: 'bold',
        color: '#34495e',
        marginBottom: '5px',
    },
    infoText: {
        marginLeft: '20px',
        fontSize: '16px',
        color: '#7f8c8d',
    },
    price: {
        marginLeft: '20px',
        fontSize: '18px',
        color: '#000000',
        fontWeight: 'bold',
    },
    button: {
        display: 'block',
        margin: '20px auto',
        padding: '10px 20px',
        backgroundColor: '#3498db',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        textTransform: 'uppercase',
        fontWeight: 'bold',
    },
    buttonHover: {
        backgroundColor: '#2980b9',
    },
    contactDetails: {
        marginTop: '20px',
    },
};

export default ProductDetail;
