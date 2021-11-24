import React from 'react';
import "./Product.css";
import {Link} from "react-router-dom";
import Chart from "../../components/Chart/Chart";
import { productData } from '../../DummyData';
import PublishIcon from '@mui/icons-material/Publish';

export default function Product() {
    return (
        <div className="product">
            <div className="productTitleContainer">
                <h1 className="productTitle">Product</h1>
                <Link to="/products/newproduct">
                <button className="productAddButton">Create</button>
                </Link>
            </div>
            <div className="productTop">
                <div className="productTopLeft">
                    <Chart data={productData} dataKey="Sales" title="Sales Performance"/>
                </div>
                <div className="productTopRight">
                    <div className="productInfoTop">
                        <img src="https://www.nicepng.com/png/detail/298-2982212_apple-airpods-png.png"
                        alt=""
                        className="productInfoImg" />
                        <span className="productName">Airpods</span>
                    </div>
                    <div className="productInfoBottom">
                        <div className="productInfoItem">
                            <span className="productInfoKey">id:</span>
                            <span className="productInfoValue">123</span>
                        </div>  
                        <div className="productInfoItem">
                            <span className="productInfoKey">sales</span>
                            <span className="productInfoValue">2223</span>
                        </div> 
                        <div className="productInfoItem">
                            <span className="productInfoKey">active</span>
                            <span className="productInfoValue">yes</span>
                        </div> 
                        <div className="productInfoItem">
                            <span className="productInfoKey">Instock</span>
                            <span className="productInfoValue">yes</span>
                        </div>   
                    </div>    
                </div>
            </div>
            <div className="productBottom">
                <form className="productForm">
                    <div className="productFormLeft">
                        <label>Product Name</label>
                        <input type="text" placeholder="Airpods" />
                        <label>In Stock</label>
                        <select name="idStock" id="idStock">
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                        <label>Active</label>
                        <select name="active" id="active">
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </div>
                    <div className="productFormRight">
                        <div className="productUpload">
                            <img src="https://www.nicepng.com/png/detail/298-2982212_apple-airpods-png.png"
                            alt=""
                            className="productUploadImg"
                            />
                            <label for="file">
                                <PublishIcon />
                            </label>
                        </div>
                        <input type="file" id="file" style={{display:"none"}}/>
                        <button className="productButton">Update</button>
                    </div>
                    
                </form>
            </div>
        </div>
    )
}
