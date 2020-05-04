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
        transactionsList: [],
        transactionId: "",
        activeProducts: [],
        modalOpen: false,
    };

    getTransactionList = () => {

        Axios.get(`${API_URL}/transactions`)
        
            .then((res) => {
                console.log(res.data);
                this.setState({ transactionsList: res.data });
                this.setState({ transactionId: res.data.id });
            })
            .catch((err) => {
                console.log(err);
            });
    };



    approvedHandler = (id) => {

        Axios.get(`${API_URL}/transactions`)
            .then((res) => {
                Axios.patch(`${API_URL}/transactions/${id}`, {
                    ...this.state.transactionsList,
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


    renderTransactionList = () =>{

        return this.state.transactionsList.map((val, idx) => {

            return(
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
                        <td> {val.status} </td>
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
                                        val.productList.map((val) => {
                                            return (
                                                <tbody>
                                                    <tr>
                                                        <td>{val.product.productName}</td>
                                                        <td>{val.quantity}</td>
                                                        <td>{val.product.price}</td>
                                                        <td>{val.quantity * val.product.price}</td>
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
                                    <ButtonUI type="outlined">Canceled</ButtonUI>
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
    componentDidMount() {
        this.getTransactionList()
    }
    render() {
        return (
            <div className="container py-4">
                <div className="dashboard">
                    <caption className="p-3">
                        <h2>PAYMENT</h2>
                    </caption>
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

