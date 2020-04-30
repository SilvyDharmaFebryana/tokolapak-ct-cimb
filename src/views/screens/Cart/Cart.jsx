import React, { useState } from 'react'
import "./Cart.css"
import { connect } from 'react-redux'
import Axios from 'axios'
import { API_URL } from '../../../constants/API'
import ButtonUI from '../../components/Button/Button'
import swal from 'sweetalert'
import { Table, Alert } from 'reactstrap'
import { Link } from "react-router-dom";
import { UncontrolledCollapse, Button, CardBody, Card } from 'reactstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons/";

class Cart extends React.Component {

    state = {
        listProductCart: [],
        
    };

    getDataHandler = () => {
        Axios.get(`${API_URL}/cart`, {
            params: {
                userId: this.props.user.id,
                _expand: "product"
            }
        })
            .then((res) => {
                console.log(res.data);
                this.setState({ listProductCart: res.data })
            })
            .catch((err) => {
                console.log(err);
            })
    }

    deleteDataHandler = (id) => {
        Axios.delete(`${API_URL}/cart/${id}`)
            .then((res) => {
                swal("success deleted", "", "success")
                this.getDataHandler()
            })
            .catch((err) => {
                console.log(err);
            });
    };

    componentDidMount() {
        this.getDataHandler()
    }

    renderCartData = () => {
        const { listProductCart } = this.state;
        return listProductCart.map((val, idx) => {
            return (
                <tr>
                    <td> {idx + 1} </td>
                    <td style={{ width: "30%" }}><img className="justify-content-center" style={{ width: "10%" }} src={val.product.image} alt="" /></td>
                    <td> {val.product.productName} </td>
                    <td> {val.quantity} </td>
                    <td>
                        {
                            new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(val.product.price)
                        }
                    </td>
                    <td><ButtonUI type="contained" onClick={() => this.deleteDataHandler(val.id)} >Delete</ButtonUI></td>
                </tr>
            );
        });
    };

    checkoutHandlder = () => {
        const { listProductCart } = this.state
        return listProductCart.map((val, idx) => {
            const { quantity, product } = val;
            const { productName, price } = product;
            const prices = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(price)
            const totals = quantity * price
            return (
                <tr>
                    <td>{idx + 1}</td>
                    <td>{productName}</td>
                    <td>{quantity}</td>
                    <td>{prices}</td>
                    <td>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(totals)}</td>
                </tr>
            )
        })
    }

    totalPrices = () => {
        const { listProductCart } = this.state
        let subTotal = 0
        
        return listProductCart.map((val, idx) => {
            const { quantity, product } = val;
            const { price } = product; 
            return (
                subTotal += (quantity * price)
            )
        })
    }

    
    confirmToPay = () => {

    }   




    render() {

        return (
            <div className="container">
                {
                    this.state.listProductCart.length == 0 ? (
                        <Alert color="primary" className="mt-4">Your cart is empty! <Link to="/">Go Shopping</Link></Alert>
                    ) :
                        <>
                        <center>
                            <Table className="table table-striped" style={{ width: "80%" }} >
                                <thead>
                                    <tr>
                                        <th scope="col">No</th>
                                        <th scope="col">Product</th>
                                        <th scope="col">Product Name</th>
                                        <th scope="col">Qty</th>
                                        <th scope="col">Price</th>
                                        <th scope="col"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.renderCartData()}
                                </tbody>
                            </Table>

                            <div>
                                <ButtonUI type="outlined" id="toggler" style={{ marginBottom: '1rem' }}>
                                    Checkout
                                </ButtonUI>

                            </div>
                        </center>

                        <div>
                            <UncontrolledCollapse toggler="#toggler">
                                <Card>
                                    <CardBody>
                                            <div className="d-flex flex-row py-2 justify-content-center" style={{ backgroundColor: "#e6eeff" }}>
                                            <FontAwesomeIcon
                                                className="mr-2 mt-2"
                                                icon={faShoppingCart}
                                                style={{ fontSize: 24 }}
                                            />
                                            <h4 className="mt-2">Checkout</h4>
                                        </div>
                                        
                                        <div className="mt-3">
                                                <Table>
                                                    <thead>
                                                        <tr>
                                                            <th> No</th>
                                                            <th>Product Name</th>
                                                            <th>Quantity</th>
                                                            <th>Price</th>
                                                            <th>Totals</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            this.checkoutHandlder()
                                                        }
                                                    </tbody>
                                                    <tfoot>
                                                        <tr>
                                                            <td colSpan={4} className="text-center"> Total</td>
                                                            <td>
                                                                {  
                                                                    this.totalPrices()
                                                                }
                                                            </td>
                                                        </tr>
                                                    </tfoot>
                                                </Table>
                                        </div>                               
                                        <div>
                                            <ButtonUI type="contained">Confirm to Pay</ButtonUI>
                                        </div>
                                    </CardBody>
                                </Card>
                            </UncontrolledCollapse>
                        </div>
                        </>
                }
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
    }
}


export default connect(mapStateToProps)(Cart)


//     < div >
//     <Button color="primary" id="toggler" style={{ marginBottom: '1rem' }}>
//         Toggle
//     </Button>
//     <UncontrolledCollapse toggler="#toggler">
//         <Card>
//             <CardBody>
//                 Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt magni, voluptas debitis
//                 similique porro a molestias consequuntur earum odio officiis natus, amet hic, iste sed
//                 dignissimos esse fuga! Minus, alias.
//         </CardBody>
//         </Card>
//     </UncontrolledCollapse>
//   </div >