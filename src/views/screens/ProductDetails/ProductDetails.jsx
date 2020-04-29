import React from 'react'
import { connect } from 'react-redux'
import './ProductDetails.css'
import ButtonUI from '../../components/Button/Button'
import TextField from '../../components/TextField/TextField'
import Axios from 'axios'
import { API_URL } from "../../../constants/API";
import swal from 'sweetalert'

class ProductDetails extends React.Component {
    state = {
        productData: {
            id: 0,
            productName: "",
            price: 0,
            desc: "",
            image: "",
        }
    };

    addToCartHandler = () => {
        //POST ke /cart
        console.log(this.props.user.id);
        
        Axios.post(`${API_URL}/cart`, {
            userId: this.props.user.id,
            productId: this.state.productData.id,
            quantity: 1,
        })
        .then((res) => {
            console.log(res);
            swal("", "Your item has been add to your cart", "success")
        })
        .catch((err) => {
            console.log(err);
            
        })

    }

    componentDidMount() {
        let productId = this.props.match.params.productId;

        Axios.get(`${API_URL}/products/${productId}`)
            .then((res) => {
                console.log(res);
                this.setState({
                   productData: res.data
                });
            })
            .catch((err) => {
                console.log(err);
            });
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
                        <div className="d-flex flex-row mt-4">
                            <ButtonUI type="contained" onClick={this.addToCartHandler}>Add to cart</ButtonUI>
                            <ButtonUI className="ml-4" type="outlined">Add to wishlist</ButtonUI>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(ProductDetails)