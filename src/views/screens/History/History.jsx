import React from "react";

import { Modal, ModalHeader, ModalBody } from "reactstrap";
import Axios from "axios";
import { connect } from 'react-redux'
import { UncontrolledCollapse, Button, CardBody, Card } from 'reactstrap';

import { API_URL } from "../../../constants/API";

import ButtonUI from "../../components/Button/Button";
import TextField from "../../components/TextField/TextField";

import swal from "sweetalert";

class History extends React.Component {
    state = {
        historyList: [],
        transactionId: "",
        activeProducts: [],
        modalOpen: false,
    };

    getTransactionList = () => {

        Axios.get(`${API_URL}/transactions`, {
            params: {
                userId: this.props.user.id,
                status: "approved",
                _embed: "transactionsDetails",
            }
        })
            .then((res) => {

                this.setState({
                    historyList: res.data
                });
                console.log(res.data);
                
            })
            .catch((err) => {
                console.log(err);
            });
    };


    componentDidMount() {
        this.getTransactionList()
    }


    renderTransactionList = () => {

        return this.state.historyList.map((val, idx) => {
            return (
                <>
                    <tr
                        onClick={() => {
                            if (this.state.activeProducts.includes(idx)) {
                                this.setState({
                                    activeProducts: [
                                        ...this.state.activeProducts.filter((item) => item !== idx),
                                    ],
                                });
                            } else {
                                this.setState({
                                    activeProducts: [...this.state.activeProducts, idx],
                                });
                            }
                        }}
                        id="toggler"
                    >

                        <td> {val.userId} </td>
                        <td> {val.fullName} </td>
                        <td> {val.totalItems} </td>
                        <td>  {
                            new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(val.subTotals)
                        }
                        </td>
                        <td> {val.paymentMethod} </td>
                        <td> trnsctn-00{val.id}-sccs </td>
                        <td>
                            {
                                val.status === "approved" ? (
                                    <p style={{ color: "#00b33c", textDecoration: "bold", fontWeight: "1000" }}>Success</p>
                                ) : null
                            }
                        </td>
                    </tr>

                    <tr
                        className={`collapse-item ${
                            this.state.activeProducts.includes(idx) ? "active" : null
                            }`}
                    >
                        <td className="" colSpan={8}>
                            <div className="d-flex flex-row justify-content-center">
                                <table className="small justify-content-center">
                                    <thead>
                                        <tr>
                                            <th>Image</th>
                                            <th>Product Name</th>
                                            <th>Quantity</th>
                                            <th>Item Price</th>
                                            <th>Item Total</th>
                                            <th></th>

                                        </tr>
                                    </thead>
                                    {
                                        val.transactionsDetails.map((val) => {
                                            return (
                                                <tbody>
                                                    <tr>
                                                        <td><img src={val.itemImage} style={{ width: "75%" }} /></td>
                                                        <td>{val.itemName}</td>
                                                        <td>{val.itemQuantity}</td>
                                                        <td>{val.itemPrice}</td>
                                                        <td>{val.itemQuantity * val.itemPrice}</td>
                                                    </tr>
                                                </tbody>

                                            )
                                        })
                                    }
                                    <tfoot>
                                        <tr colSpan={2}>
                                            <th>Delivery To</th>
                                            <td>:</td>
                                            <td>{val.fullName}</td>
                                        </tr>
                                        <tr colSpan={2}>
                                            <th>Delivery Address</th>
                                            <td>:</td>
                                            <td>{val.address}</td>
                                        </tr>
                                        <tr colSpan={3}>
                                            <th>Payment</th>
                                            <td>:</td>
                                            <td>{val.paymentMethod}</td>
                                        </tr>
                                        <tr colSpan={3}>
                                            <th>Date of Payment</th>
                                            <td>:</td>
                                            <td>{val.startDate}</td>
                                        </tr>
                                        <tr colSpan={3}>
                                            <th>Date Clear</th>
                                            <td>:</td>
                                            <td>{val.endDate}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>

                        </td>
                    </tr>

                </>
            )
        })
    }


    toggleModal = () => {
        this.setState({ modalOpen: !this.state.modalOpen });
    };

    render() {
        return (
            <div className="container py-4">
                <div className="dashboard">
                    <caption className="p-3">
                        <h2>HISTORY CART</h2>
                    </caption>
                    <table className="dashboard-table">
                        <thead>
                            <tr>

                                <th>User ID</th>
                                <th>Full Name</th>
                                <th>Total Items</th>
                                <th>Total Price</th>
                                <th>Payment Method</th>
                                <th>Transaction ID</th>
                                <th>Status</th>

                            </tr>
                        </thead>
                        <tbody>{this.renderTransactionList()}</tbody>
                    </table>
                </div>

                <Modal
                    toggle={this.toggleModal}
                    isOpen={this.state.modalOpen}
                    className="edit-modal"
                >
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
    }
}

export default connect(mapStateToProps)(History);
