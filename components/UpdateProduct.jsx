import { useEffect, useState } from "react";
import Header from "./Header";
import { useNavigate} from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";
import categories from "./categories";
function UpdateProduct() {
    const navigate = useNavigate();
    useEffect(()=>{
        if(!localStorage.getItem('token')){
            navigate('/login')
        }
    })
    const [pname,setPname]  = useState('')
    const [pdesc,setPdesc]  = useState('')
    const [pprice,setPprice]  = useState('')
    const [pcat,setPcat]  = useState('')
    const [pimg1,setP1img]  = useState(null)
    const [pimg2,setP2img]  = useState(null)
    const  p = useParams();
    // console.log(p);
    useEffect(() => {
        const url = 'http://localhost:4000/product/' + p.productId;
        axios.get(url)
            .then((res) => {
                if (res.data.product) {
                    // console.log(res.data.product);
                    let product  = res.data.product;
                    setPname(product.pname);
                    setPdesc(product.pdesc);
                    setPprice(product.pprice);
                    setPcat(product.pcat);
                }
            })
            .catch((err) => {
                console.log(err);
                alert('SERVER ERROR');
            });
    }, [p]);


    const handleApi = () => {
        const formData = new FormData();
        formData.append('pid', p.productId);
        formData.append('pname', pname);
        formData.append('pdesc', pdesc);
        formData.append('pprice', pprice);
        formData.append('pcat', pcat);
        formData.append('pimg1', pimg1); // Use the state directly
        formData.append('pimg2', pimg2); // Use the state directly
        formData.append('userId', localStorage.getItem('userId'));

        const url = 'http://localhost:4000/update-product';
        axios.post(url, formData)
          .then((res) => {            
            if(res.data.message)
            {
                alert(`Product Updated`);
                navigate('/')
            }
          })
          .catch((err) => {
            console.log(err);
          });
      };
      return (
        <div>
            <Header />
            <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh', marginTop: '100px' }}>
                <div className="col-md-8">
                    <div className="p-4 border rounded">
                        <h2 className="text-center mb-4">UPDATE YOUR PRODUCT INFORMATION</h2>
                        <label>PRODUCT NAME</label>
                        <input className="form-control mb-3" type="text" value={pname} onChange={(e) => setPname(e.target.value)} />
                        <label>PRODUCT DESCRIPTION</label>
                        <input className="form-control mb-3" type="text" value={pdesc} onChange={(e) => setPdesc(e.target.value)} />
                        <label>PRODUCT PRICE</label>
                        <input className="form-control mb-3" type="text" value={pprice} onChange={(e) => setPprice(e.target.value)} />
                        <label>PRODUCT CATEGORY</label>
                        <select className="form-select mb-3" aria-label="Default select example" value={pcat} onChange={(e) => setPcat(e.target.value)}>
                            <option>SELECT ONE</option>
                            {categories && categories.length > 0 && categories.map((item, index) => (
                                <option key={'option' + index}>{item}</option>
                            ))}
                        </select>
                        <label>UPDATE EXISTING IMAGE </label>
                        <input className="form-control mb-3" type="file" onChange={(e) => setP1img(e.target.files[0])} />
                        <label>ADD NEW PRODUCT IMAGE </label>
                        <input className="form-control mb-3" type="file" onChange={(e) => setP2img(e.target.files[0])} />
                        <button onClick={handleApi} type="button" className="btn btn-primary btn-lg w-100">UPDATE PRODUCT INFORMATION</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UpdateProduct;
