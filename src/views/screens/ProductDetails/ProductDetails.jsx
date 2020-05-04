import React from 'react'
import { connect } from 'react-redux'
import './ProductDetails.css'
import ButtonUI from '../../components/Button/Button'
import TextField from '../../components/TextField/TextField'
import Axios from 'axios'
import { API_URL } from "../../../constants/API";
import swal from 'sweetalert'
import { throwStatement } from '@babel/types'
import { Redirect } from "react-router-dom";


class ProductDetails extends React.Component {
    state = {
        productData: {
            id: 0,
            productName: "",
            price: 0,
            desc: "",
            image: "",
            quantity: 0,
        },
        productCartAlready: []
    };
    


    addToCartHandler = () => {
        Axios.get(`${API_URL}/cart/`, {
            params: {
                userId: this.props.user.id,
                productId: this.state.productData.id
            }
        }) 
        .then((res) => {
            if (res.data.length == 0){
                Axios.post(`${API_URL}/cart`, {
                    userId: this.props.user.id,
                    productId: this.state.productData.id,
                    quantity: 1,
                })
                    .then((res) => {
                        console.log(res.data);
                        swal("", "Your item has been add to your cart", "success")
                    })
                    .catch((err) => {
                        console.log(err);

                    })
            } else {    
                Axios.patch(`${API_URL}/cart/${res.data[0].id}`,{
                    ...this.state.productData,
                    quantity: res.data[0].quantity + 1
                })
                .then((res) => {
                    console.log(res);                  
                    swal("", "Your item has been add to your cart", "success")
                })
                .catch((err) => {
                    console.log(err);
                    
                })

            }
        })
        .catch((err) => {
            console.log(err);
            
        })
    }


    getProductData = () => {
        let productId = this.props.match.params.productId;

        Axios.get(`${API_URL}/products/${productId}`)
            .then((res) => {
                console.log(res.data);
                this.setState({
                    productData: res.data
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    componentDidMount() {
        this.getProductData()
    }
    

    addToCartAlert = () => {
        swal('anda harus login!')
        // return <Redirect to="/auth" />
    }
    
    render() {

        const {
            image,
            price,
            productName,
            desc
        } = this.state.productData


        return (
            <div className="container">
                <div className="row py-4">
                    <div className="col-6 text-center">
                        <img 
                        style={{ width: "100%", objectFit: "contain", height: "550px"}}
                        src={image} 
                        alt=""/>
                    </div>
                    <div className="col-6 d-flex flex-column justify-content-center">
                        <h3>{productName}</h3>
                        <h4>
                            {
                                new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(price)

                            }
                        </h4>
                        <p className="mt-4">
                            {desc}
                        </p>
                        {/* <TextField type="number" placeholder="Quantity" className="mt-3" /> */}
                        {
                            this.props.user.id > 0 ? (
                                <div className="d-flex flex-row mt-4">
                                    <ButtonUI type="contained" onClick={this.addToCartHandler}>Add to cart</ButtonUI>
                                    <ButtonUI className="ml-4" type="outlined">Add to wishlist</ButtonUI>

                                </div>
                            ) : <div className="d-flex flex-row mt-4">
                                    <ButtonUI type="contained" onClick={this.addToCartAlert}>Add to cart</ButtonUI>
                                    <ButtonUI className="ml-4" type="outlined">Add to wishlist</ButtonUI>

                                </div>
                        }
                       
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(ProductDetails)
