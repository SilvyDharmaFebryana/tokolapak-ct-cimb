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
        transaction: {
            userId: "",
            fullName: "",
            address: "",
            email: "",
            status: "pending",
            subTotals: 0,
            startDate: "",
            endDate: "",
            totalItems: "",
            paymentMethod: "Transfer Bank",
            productList: []
        },
        totalItems: 0,
        itemPrice: 0,
        itemQuantity: "",
        transactionId: "",
        itemName: "",
        listProductCart: [],
        checkoutItems: []
    };

    getDataHandler = () => {
        let subTotal = 0
        let totalQty = 0
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
                    totalQty += quantity
                })
                this.setState({
                    transaction: {
                        ...this.state.transaction,
                        subTotals: subTotal,
                        productList: res.data,
                        fullName: this.props.user.fullName,
                        address: this.props.user.address,
                        userId: this.props.user.id,
                        email: this.props.user.email,
                        startDate: new Date().toLocaleString(),
                        totalItems: totalQty,
                    },
                    listProductCart: res.data
                })

            })
            .catch((err) => {
                console.log(err);
            })

    }

    deleteDataHandler = (id) => {
        Axios.delete(`${API_URL}/cart/${id}`)
            .then((res) => {
                this.getDataHandler()
            })
            .catch((err) => {
                console.log(err);
            });
    };

    componentDidMount() {
        this.getDataHandler()

    }

    checkoutHandlder = (e, idx) => {
        const { checked } = e.target
        if (checked) {
            this.setState({ checkoutItems: [...this.state.checkoutItems, idx] })
            console.log(this.state.checkoutItems);

        } else {
            this.setState({
                checkoutItems: [
                    ...this.state.checkoutItem.filter((val) => val !== idx)]
            })
        }
    }

    renderCartData = () => {
        const { listProductCart } = this.state
        return listProductCart.map((val, idx) => {
            return (
                <tr>
                    <td><input type="checkbox" onChange={(e) => this.checkoutHandlder(e, idx)} /></td>
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
            const { quantity, product, startDate } = val;
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
                    <td>{startDate}</td>
                </tr>
            )
        })
    }

    confirmToPay = () => {
        Axios.get(`${API_URL}/cart`, {
            params: {
                userId: this.props.user.id,
                _expand: "product"
            }
        })
            .then((res) => {
                    Axios.post(`${API_URL}/transactions`, this.state.transaction)
                        .then((res) => {
                            this.state.listProductCart.map((val) => {
                                this.deleteDataHandler(val.id)
                                Axios.post(`${API_URL}/transactionsDetails`, {
                                    transactionId: res.data.id,
                                    itemPrice: val.product.price,
                                    itemQuantity: val.quantity,
                                    itemName: val.product.productName,
                                    totalItems: val.product.price * val.quantity
                                })
                                    .then((res) => {
                                        console.log(res.data)
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                    })
                            })
                            swal("Transaction Success!", "Your transaction has been processed", "success")
                        })
                        .catch((err) => {
                            console.log(err);

                        })
                
            })
            .catch((err) => {
                console.log(err);
            })
      
    }

    inputHandler = (e, field, form) => {
        let { value } = e.target;
        this.setState({
            [form]: {
                ...this.state[form],
                [field]: value,
            },
        });
    };



    render() {
        const {
            fullName,
            address,
            subTotals,
            status,
            email,
            startDate,
            totalItems,
        } = this.state.transaction

        return (
            <div className="container">
                {
                    this.state.listProductCart.length == 0 ? (
                        <Alert color="primary" className="mt-4">Your cart is empty! <Link to="/">Go Shopping</Link></Alert>
                    ) :
                        <>
                            <center>
                                <Table className="table-striped" style={{ width: "80%" }} >
                                    <thead>
                                        <tr>
                                            <th scope="col"></th>
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
                                                            <td colSpan={4} className="text-center"><h5>Total</h5></td>
                                                            <td>
                                                                <h5>
                                                                    {
                                                                        new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(subTotals)
                                                                    }
                                                                </h5>
                                                            </td>
                                                        </tr>
                                                    </tfoot>
                                                </Table>
                                            </div>

                                            <div className="d-flex flex-row py-2 justify-content-center" style={{ backgroundColor: "#e6eeff" }}>
                                                <h6 className="mt-1">Details</h6>
                                            </div>
                                            <div>
                                                <Table>
                                                    <tr>
                                                        <th>Delivery To</th>
                                                        <td>:</td>
                                                        <td>{fullName}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Address</th>
                                                        <td>:</td>
                                                        <td>{address}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Email</th>
                                                        <td>:</td>
                                                        <td>{email}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Total of Items</th>
                                                        <td>:</td>
                                                        <td>{totalItems}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Total Price</th>
                                                        <td>:</td>
                                                        <td>
                                                            {
                                                                new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(subTotals)
                                                            }
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th>Status</th>
                                                        <td>:</td>
                                                        <td>{status}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Date of Payment</th>
                                                        <td>:</td>
                                                        <td>{startDate}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Payment Method</th>
                                                        <td>:</td>
                                                        <td>
                                                            <select
                                                            value={this.state.transaction.paymentMethod}
                                                            className="custom-text-input h-100 pl-3"
                                                            onChange={(e) => this.inputHandler(e, "paymentMethod", "transaction")}
                                                            >
                                                                <option value="Transfer Bank">Transfer Bank</option>
                                                                <option value="Indomart">Indomart</option>
                                                                <option value="Alfamart">Alfamart</option>
                                                                <option value="Credit Card">Credit Card</option>
                                                            </select>
                                                        </td>
                                                    </tr>

                                                </Table>
                                            </div>

                                            <div className="mt-4 d-flex flex-row-reverse">
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



// postTransactionHandler = () => {
//     Axios.get(`${API_URL}/carts`, {
//         params: {
//             userId: this.props.user.id,
//             _expand: "product",
//         },
//     })
//         .then((res) => {
//             res.data.map(val => {
//                 { this.deletedata(val.id) }
//                 this.setState({
//                     productId: val.product.id,
//                     price: val.product.price,
//                     quantity: val.quantity,
//                     totalPriceProduct: val.quantity * val.product.price,
//                     productName: val.product.productName
//                 })
//             })
//             console.log(res.data);
//             Axios.post(`${API_URL}/transactions`, {
//                 userId: this.props.user.id,
//                 totalprice: this.state.subTotalFix,
//                 status: this.state.status,
//                 tgl_selesai: this.state.tgl_selesai,
//                 tgl_belanja: this.state.tgl_belanja,
//                 pengiriman: this.props.user.address,
//                 metodePembayaran: this.state.metodePembayaran,
//             })
//                 .then((res) => {
//                     this.setState({ listProductCart: "" })
//                     Axios.post(`${API_URL}/transactionDetail`, {
//                         transactionId: res.data.id,
//                         productId: this.state.productId,
//                         price: this.state.price,
//                         quantity: this.state.quantity,
//                         totalPriceProduct: this.state.totalPriceProduct,
//                         productName: this.state.productName,
//                     })
//                         .then((res) => {
//                             console.log(res);
//                         })
//                         .catch((err) => {
//                             console.log(err);
//                         })
//                     console.log(res);
//                     swal("Sukses", "Please check your history transaction", "success")
//                 })
//                 .catch((err) => {
//                     console.log(err);
//                 })
//         })
//         .catch((err) => {
//             console.log(err);
//         })
// }