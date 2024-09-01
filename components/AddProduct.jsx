import { useEffect, useState } from "react";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import categories from "./categories";

function AddProduct() {
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login');
        }
    }, [navigate]);

    const [pname, setPname] = useState('');
    const [pdesc, setPdesc] = useState('');
    const [pprice, setPprice] = useState('');
    const [pcat, setPcat] = useState('');
    const [pimg1, setP1img] = useState(null);
    const [pimg2, setP2img] = useState(null);

    const handleApi = () => {
        if (!pimg1) {
            alert("Product image 1 field is required.");
            return;
        }

        if (!pname || !pdesc || !pprice || !pcat) {
            alert("Please fill all the fields.");
            return;
        }

        const formData = new FormData();
        formData.append('pname', pname);
        formData.append('pdesc', pdesc);
        formData.append('pprice', pprice);
        formData.append('pcat', pcat);
        formData.append('pimg1', pimg1);
        formData.append('pimg2', pimg2);
        formData.append('userId', localStorage.getItem('userId'));

        const url = 'http://localhost:4000/add-product';
        axios.post(url, formData)
            .then((res) => {
                if (res.data.message) {
                    alert('Product Added');
                    navigate('/');
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <div className="container mt-4">
            {/* <Header /> */}
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow-lg p-4 mb-4 rounded">
                        <div className="card-body">
                            <h2 className="text-center mb-4">Add Your Product</h2>
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="pname" className="form-label">Product Name</label>
                                    <input
                                        id="pname"
                                        className={`form-control ${!pname ? 'is-invalid' : ''}`}
                                        type="text"
                                        value={pname}
                                        onChange={(e) => setPname(e.target.value)}
                                    />
                                    {!pname && <div className="invalid-feedback">Product name is required.</div>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="pdesc" className="form-label">Product Description</label>
                                    <input
                                        id="pdesc"
                                        className={`form-control ${!pdesc ? 'is-invalid' : ''}`}
                                        type="text"
                                        value={pdesc}
                                        onChange={(e) => setPdesc(e.target.value)}
                                    />
                                    {!pdesc && <div className="invalid-feedback">Product description is required.</div>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="pprice" className="form-label">Product Price</label>
                                    <input
                                        id="pprice"
                                        className={`form-control ${!pprice ? 'is-invalid' : ''}`}
                                        type="text"
                                        value={pprice}
                                        onChange={(e) => setPprice(e.target.value)}
                                    />
                                    {!pprice && <div className="invalid-feedback">Product price is required.</div>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="pcat" className="form-label">Product Category</label>
                                    <select
                                        id="pcat"
                                        className={`form-select ${!pcat ? 'is-invalid' : ''}`}
                                        value={pcat}
                                        onChange={(e) => setPcat(e.target.value)}
                                    >
                                        <option value="">Select One</option>
                                        {categories && categories.length > 0 &&
                                            categories.map((item, index) => (
                                                <option key={index} value={item}>{item}</option>
                                            ))
                                        }
                                    </select>
                                    {!pcat && <div className="invalid-feedback">Product category is required.</div>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="pimg1" className="form-label">Product Image 1</label>
                                    <input
                                        id="pimg1"
                                        className={`form-control ${!pimg1 ? 'is-invalid' : ''}`}
                                        type="file"
                                        onChange={(e) => setP1img(e.target.files[0])}
                                    />
                                    {!pimg1 && <div className="invalid-feedback">Product image 1 is required.</div>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="pimg2" className="form-label">Product Image 2</label>
                                    <input
                                        id="pimg2"
                                        className="form-control"
                                        type="file"
                                        onChange={(e) => setP2img(e.target.files[0])}
                                    />
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-primary btn-lg w-100 mt-3"
                                    onClick={handleApi}
                                >
                                    Add Product
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddProduct;
