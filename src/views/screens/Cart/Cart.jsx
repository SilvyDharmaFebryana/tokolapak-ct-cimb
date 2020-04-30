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
        transactionDetails: {
            userId: "",
            fullName: "",
            address: "",
            status: "pending",
            productList: [],
            subTotals: 0
        },
        listProductCart: [],
    };

    getDataHandler = () => {

        let subTotal = 0

        Axios.get(`${API_URL}/cart`, {
            params: {
                userId: this.props.user.id,
                _expand: "product"
            }
        })
            .then((res) => {

                res.data.map((val) => {
                    const { quantity, product } = val;
                    const { price } = product;
                    subTotal += quantity * price
                })

                this.setState({
                    transactionDetails: {
                        ...this.state.transactionDetails,
                        productList: res.data,
                        subTotals: subTotal,
                        fullName: this.props.user.fullName,
                        address: this.props.user.address,
                        userId: this.props.user.id
                        
                    }
                })

                console.log(this.state.transactionDetails.productList)
                console.log(this.state.transactionDetails);
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
        const { productList } = this.state.transactionDetails
        return productList.map((val, idx) => {
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
        const { productList } = this.state.transactionDetails
        return productList.map((val, idx) => {
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


    confirmToPay = () => {

        Axios.post(`${API_URL}/transactions`, this.state.transactionDetails)
        .then((res) => {
            console.log(res);
            this.state.transactionDetails.productList.map((val) => {

                this.deleteDataHandler(val.id)
                console.log(val.productId);
                
            })
        })
        .catch((err) => {
            console.log(err);
            
        })
    }




    render() {

        return (
            <div className="container">
                {
                    this.state.transactionDetails.productList.length == 0 ? (
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
                                                                    this.state.transactionDetails.subTotals
                                                                }
                                                            </td>
                                                        </tr>
                                                    </tfoot>
                                                </Table>
                                            </div>
                                            <div>
                                                <ButtonUI type="contained" onClick={this.confirmToPay}>Confirm to Pay</ButtonUI>
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

