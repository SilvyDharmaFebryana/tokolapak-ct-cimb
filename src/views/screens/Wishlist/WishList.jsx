import React from 'react'
import ProductCard from "../../components/Cards/ProductCard";
import { Link } from "react-router-dom";
import Axios from "axios";
import { API_URL } from "../../../constants/API";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faStar } from "@fortawesome/free-regular-svg-icons";
import ButtonUI from "../../components/Button/Button";
import { connect } from 'react-redux'

class Wishlist extends React.Component {

    state = {
        wishlistProduct: {
            userId: "",
            wishListItem: []
        }
    }

    getWishList = (activeCategory = null) => {
        Axios.get(`${API_URL}/wishlist`, {
            params: {
                userId: this.props.user.id,
                _expand: "product"
            }
        })
            .then((res) => {
                this.setState({ 
                    wishlistProduct: {
                        ...this.state.wishlistProduct,
                        wishListItem: res.data
                    }
                 })
                 console.log(res.data);
                 
            })
            .catch((err) => {
                console.log(err)
            })
    }

    componentDidMount() {
        this.getWishList()
    }


    renderWishList = () => {
        return this.state.wishlistProduct.wishListItem.map((val) => {
            return (

                <Link to={`/product/${val.product.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <div className={`product-card d-inline-block ${this.props.className}`}>
                        <img
                            src={val.product.image}
                            style={{ width: "224px", height: "250px", objectFit: "contain" }}
                        />
                        <div>
                            <p className="mt-3">{val.product.productName}</p>
                            <h5 style={{ fontWeight: "bolder" }}>
                                {new Intl.NumberFormat("id-ID", {
                                    style: "currency",
                                    currency: "IDR",
                                }).format(val.product.price)}
                            </h5>
                            <p className="small">Jakarta Selatan</p>
                        </div>
                        <div className="d-flex flex-row align-items-center justify-content-between mt-2">
                            <div>
                                <div className="d-flex flex-row align-items-center justify-content-between">
                                    {/* Render stars dynamically */}
                                    <FontAwesomeIcon style={{ fontSize: "10px" }} icon={faStar} />
                                    <FontAwesomeIcon style={{ fontSize: "10px" }} icon={faStar} />
                                    <FontAwesomeIcon style={{ fontSize: "10px" }} icon={faStar} />
                                    <FontAwesomeIcon style={{ fontSize: "10px" }} icon={faStar} />
                                    <FontAwesomeIcon style={{ fontSize: "10px" }} icon={faStar} />
                                    <small className="ml-2">4.5</small>
                                </div>
                            </div>
                            <ButtonUI
                                type="outlined"
                                style={{ fontSize: "12px", padding: "4px 8px" }}
                                id=""
                            >
                                {" "}
                                Delete from wishlist
                        </ButtonUI>
                        </div>
                    </div>
                </Link>              
            )
    
        })
    }

    render() {
        return (
            < div className = "container" >
            {/* BEST SELLER SECTION */ }
            < h2 className = "text-center font-weight-bolder mt-5" > WISHLIST</h2 >
                <div className="row d-flex flex-wrap justify-content-center">
                    {
                        this.renderWishList()
                    }
                </div>
        </div >
        )
    }
}

const mapStateToProps = (state) => {
    return{
        user: state.user
    }
}


export default connect(mapStateToProps)(Wishlist)