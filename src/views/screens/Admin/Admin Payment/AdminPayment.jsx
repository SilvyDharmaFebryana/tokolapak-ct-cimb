import React from "react";
import "./AdminPayment.css";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import Axios from "axios";
import { connect } from 'react-redux'
import { UncontrolledCollapse, Button, CardBody, Card } from 'reactstrap';

import { API_URL } from "../../../../constants/API";

import ButtonUI from "../../../components/Button/Button";
import TextField from "../../../components/TextField/TextField";

import swal from "sweetalert";

class AdminPayment extends React.Component {
    state = {
        transactionsList: {
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
            listDetail: [],
        },
        transactionListDetail: [],
        transactionId: "",
        activeProducts: [],
        modalOpen: false,
        activeButton: "pending",
        pendingList: [],
        approvedList: []
    };

    getTransactionList = () => {

        Axios.get(`${API_URL}/transactions`, {
            params: {
                _embed: "transactionsDetails"
            }
        })
            .then((res) => {
                console.log(res.data);
                this.setState({ 
                   transactionListDetail : res.data
                })
                
            })
            .catch((err) => {
                console.log(err);
            });
    };



    approvedHandler = (id) => {

        Axios.get(`${API_URL}/transactions`)
            .then((res) => {
                Axios.patch(`${API_URL}/transactions/${id}`, {
                    ...this.state.transactionListDetail,
                    endDate: new Date().toLocaleString(),
                    status: "approved"
                })
                    .then((res) => {
                        console.log(res.data);
                        swal("", "Approved", "success")
                    })
                    .catch((err) => {
                        console.log(err);
                    })
                })
            .catch((err) => {
                console.log(err);
                    
            })
                    
    
    }

    getPendingStatus = () => {

            Axios.get(`${API_URL}/transactions`, {
                params: {
                    status: "pending",
                    _embed: "transactionsDetails",
                }
            })
                .then((res) => {

                    this.setState({
                        pendingList: res.data
                    });
                    console.log(res.data);

                })
                .catch((err) => {
                    console.log(err);
                });

    }

    getApproveStatus = () => {

        Axios.get(`${API_URL}/transactions`, {
            params: {
                status: "approved",
                _embed: "transactionsDetails",
            }
        })
            .then((res) => {

                this.setState({
                    approvedList: res.data
                });
                console.log(res.data);

            })
            .catch((err) => {
                console.log(err);
            });

    }


    renderTransactionList = () =>{
        const { activeButton } = this.state;
        if (activeButton == "pending") {
            return this.state.pendingList.map((val, idx) => {
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
                            <td> {val.id} </td>
                            <td> {val.userId} </td>
                            <td> {val.fullName} </td>
                            <td> {val.totalItems} </td>
                            <td> {val.subTotals} </td>
                            <td> {val.paymentMethod} </td>
                            <td> <p style={{ color: "#e60000", fontWeight: "500px", textDecoration: "bold" }}>{val.status}</p></td>
                            <td><ButtonUI className="mt-3" type="textual" id="toggler" style={{ marginBottom: '1rem' }}>
                                Details
                                </ButtonUI>
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
                                                            <td>{val.itemName}</td>
                                                            <td>{val.itemQuantity}</td>
                                                            <td>{val.itemPrice}</td>
                                                            <td>{val.totalItems}</td>
                                                        </tr>
                                                    </tbody>

                                                )
                                            })
                                        }
                                        <tfoot>
                                            <tr colSpan={2}>
                                                <th>To</th>
                                                <td>:</td>
                                                <td>{val.fullName}</td>
                                            </tr>
                                            <tr colSpan={2}>
                                                <th>Delivery To</th>
                                                <td>:</td>
                                                <td>{val.address}</td>
                                            </tr>
                                            <tr colSpan={3}>
                                                <th>Payment</th>
                                                <td>:</td>
                                                <td>{val.paymentMethod}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                                <div className="d-flex justify-content-center mt-3 ">
                                    <ButtonUI className="mr-2" onClick={(_) => this.approvedHandler(val.id)} >Approve</ButtonUI>
                                </div>
                            </td>
                        </tr>
                    </>
                )
            })
        
        
        } else if ( activeButton === "approved") {
            return this.state.approvedList.map((val, idx) => {
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
                            <td> {val.id} </td>
                            <td> {val.userId} </td>
                            <td> {val.fullName} </td>
                            <td> {val.totalItems} </td>
                            <td> {val.subTotals} </td>
                            <td> {val.paymentMethod} </td>
                            <td><p style={{ color: "#009900", fontWeight: "500px", textDecoration: "bold" }}>{val.status}</p></td>
                            <td><ButtonUI className="mt-3" type="textual" id="toggler" style={{ marginBottom: '1rem' }}>
                                Details
                                </ButtonUI>
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
                                                            <td>{val.itemName}</td>
                                                            <td>{val.itemQuantity}</td>
                                                            <td>{val.itemPrice}</td>
                                                            <td>{val.totalItems}</td>
                                                        </tr>
                                                    </tbody>

                                                )
                                            })
                                        }
                                        <tfoot>
                                            <tr colSpan={2}>
                                                <th>To</th>
                                                <td>:</td>
                                                <td>{val.fullName}</td>
                                            </tr>
                                            <tr colSpan={2}>
                                                <th>Delivery To</th>
                                                <td>:</td>
                                                <td>{val.address}</td>
                                            </tr>
                                            <tr colSpan={3}>
                                                <th>Payment</th>
                                                <td>:</td>
                                                <td>{val.paymentMethod}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                                {/* <div className="d-flex justify-content-center mt-3 ">
                                    <ButtonUI className="mr-2" onClick={(_) => this.approvedHandler(val.id)} >Approve</ButtonUI>
                                    <ButtonUI type="outlined">Canceled</ButtonUI>
                                </div> */}
                            </td>
                        </tr>
                    </>
                )
            })
        
        } else if ( activeButton === "all" ){
            return this.state.transactionListDetail.map((val, idx) => {
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
                            <td> {val.id} </td>
                            <td> {val.userId} </td>
                            <td> {val.fullName} </td>
                            <td> {val.totalItems} </td>
                            <td> {val.subTotals} </td>
                            <td> {val.paymentMethod} </td>
                            <td> {
                                val.status === "approved" ? (
                                    <p style={{ color: "#009900", fontWeight: "500px", textDecoration: "bold" }}>{val.status}</p>
                                ) : <p style={{ color: "#e60000", fontWeight: "500px", textDecoration: "bold" }}>{val.status}</p>
                            } </td>
                            <td>
                                <ButtonUI className="mt-3" type="textual" id="toggler" style={{ marginBottom: '1rem' }}>
                                    Details
                                </ButtonUI>
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
                                                            <td>{val.itemName}</td>
                                                            <td>{val.itemQuantity}</td>
                                                            <td>{val.itemPrice}</td>
                                                            <td>{val.totalItems}</td>
                                                        </tr>
                                                    </tbody>

                                                )
                                            })
                                        }
                                        <tfoot>
                                            <tr colSpan={2}>
                                                <th>To</th>
                                                <td>:</td>
                                                <td>{val.fullName}</td>
                                            </tr>
                                            <tr colSpan={2}>
                                                <th>Delivery To</th>
                                                <td>:</td>
                                                <td>{val.address}</td>
                                            </tr>
                                            <tr colSpan={3}>
                                                <th>Payment</th>
                                                <td>:</td>
                                                <td>{val.paymentMethod}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                                {
                                    val.status === "pending" ? (
                                        <div className="d-flex justify-content-center mt-3 ">
                                            <ButtonUI className="mr-2" onClick={(_) => this.approvedHandler(val.id)} >Approve</ButtonUI>
                                        </div>
                                    ) :  null 
                                }
                                
                            </td>
                        </tr>
                    </>
                )
            })
        }
       
    }


    toggleModal = () => {
        this.setState({ modalOpen: !this.state.modalOpen });
    };
    componentDidMount() {
        this.getTransactionList()
        this.getPendingStatus()
        this.getApproveStatus()
    }




    render() {
        return (
            <div className="container py-4">
                <div className="dashboard">
                    <caption className="p-3">
                        <h2>PAYMENT</h2>
                    </caption>
                    <div className="d-flex flex-row mb-4 ml-2">
                        <ButtonUI
                            className={`ml-3 auth-screen-btn ${
                                this.state.activeButton == "all" ? "active" : null
                                }`}
                            type="outlined"
                            onClick={() => this.setState({ activeButton: "all" })}
                        >
                            ALL REQUEST
                        </ButtonUI>
                        <ButtonUI
                            className={`ml-3 auth-screen-btn ${
                                this.state.activeButton == "pending" ? "active" : null
                                }`}
                            type="outlined"
                            onClick={() => this.setState({ activeButton: "pending" })}
                        >
                        PENDING
                        </ButtonUI>
                        <ButtonUI
                            className={`ml-3 auth-screen-btn ${
                                this.state.activeButton == "approved" ? "active" : null
                                }`}
                            type="outlined"
                            onClick={() => this.setState({ activeButton: "approved" })}
                        >
                        APPROVE
                        </ButtonUI>
                        
                    </div>
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>User ID</th>
                                <th>Full Name</th>
                                <th>Total Items</th>
                                <th>Total Price</th>
                                <th>Payment Method</th>
                                <th>Status</th>
                                <th></th>
                                
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
    return{
        user: state.user,
    }
}

export default connect(mapStateToProps)(AdminPayment);

