import { useEffect, useState } from "react";
import Header from "./Header";
import {Link} from "react-router-dom";
import axios from "axios";
import Category from "./Categories.jsx";
import { IoHeart } from "react-icons/io5";
import './Home.css'
function LikedProducts(){
   
    const [products,setProduct] = useState([])
    const [cproducts,setcProduct] = useState([])
    const [search,setSearch] = useState('')
    useEffect(() => {
        const url = 'http://localhost:4000/liked-product';
        const data = {userId:localStorage.getItem('userId')};
        axios.post(url, data) // Send user ID as an object
            .then((res) => {
                if (res.data.products) {
                    setProduct(res.data.products)
                }
            })
            .catch((err) => {
                console.log(err);
                alert('SERVER ERROR')
            })
    }, [])
    

    const handleSearch=(value)=>{
        setSearch(value);
    }
    const handleClick=()=>{
        // console.log(`clicked`)
        console.log('Products',products);
        let filteredProducts=products.filter((item)=>
        {
            if(item.pname.toLowerCase().includes(search.toLowerCase())||
            item.pdesc.toLowerCase().includes(search.toLowerCase()) ||
            item.pcat.toLowerCase().includes(search.toLowerCase()))
            {
                return item;
            }
        })
        setProduct(filteredProducts);
    }
    const handleCategory=(value)=>{
        console.log(value,'c')
        let filteredProducts=products.filter((item)=>
        {
            if(item.pcat===(value))
            {
                return item;
            }
        })
        setcProduct(filteredProducts);
    }
    const handleLike=(productId)=>{
        let userId=localStorage.getItem('userId');
        console.log('userId:',userId);
        console.log('productId:',productId);
        const url = 'http://localhost:4000/liked-product'
        const data={userId,productId}
        axios.post(url,data)
        .then((res)=>{
             //console.log(res);
             if(res.data.message)
             {
                alert('Product liked')
             }
 
        })
        .catch((err)=>{
             console.log(err);
             alert('SERVER ERROR')
        })
    }

    return (
        <div style={{ marginTop: '100px'}}>
            <Header search={search} handleSearch={handleSearch} handleClick={handleClick}/>
            {/* <span className="center">WELCOME TO CAMPUS-CART</span> */}
            {/* <Category handleCategory={handleCategory}/> */}
            {/* <Header search={search} handleSearch={handleSearch} handleClick={handleClick}/>
            <span className="center">WELCOME TO THAPAR-BAZAR</span>
            <Category handleCategory={handleCategory}/>
            {localStorage.getItem('token')&&<Link to="/add-product">ADD PRODUCT</Link>}
            <h2>RESULTS FOR YOU</h2>
            <div className="d-flex justify-content-center flex-wrap">
            {cproducts && products.length>0 &&
                cproducts.map((item,index) => {
                    
                    console.log(item);
                    return  (
                        <div key={item._id}className="card mt-3">
                            <div onClick={()=>handleLike(item._id)} className="icon-cont">
                                <IoHeart className="icons"/>                                
                            </div>
                            <img width="300px" height="200px" src={'http://localhost:4000/'+item.pimg} alt={item.pname}/>
                            <p className="m-2">{item.pname} | {item.pcat}</p>
                            <p className="m-2 text-success">{item.pdesc}</p>
                            <p className="m-2 text-success">Rs.{item.pprice}</p>
                        </div>
                    )
                }
            )}
            </div> */}
            <h2 className="d-flex justify-content-center flex-wrap">YOUR LIKED PRODUCTS:</h2>
            <div className="d-flex justify-content-center flex-wrap">
            {products && products.length>0 &&
                products.map((item,index) => {
                    
                    console.log(item);
                    return  (
                        <div key={item._id}className="card mt-3">
                            {/* <div onClick={()=>handleLike(item._id)} className="icon-cont">
                                <IoHeart className="icons"/>                                
                            </div> */}
                            <img width="250px" height="150px" src={'http://localhost:4000/'+item.pimg1} alt={item.pname}/>
                            <p className="m-2">{item.pname} | {item.pcat}</p>
                            <p className="m-2 text-success">{item.pdesc}</p>
                            <p className="m-2 text-success">Rs.{item.pprice}</p>
                        </div>
                    )
                }
            )}
            </div>

            

        </div>
    )
}


export default LikedProducts;