import React from 'react'
import Axios from 'axios'
import { API_URL } from '../../../../constants/API'
import { connect } from 'react-redux'

class AdminReport extends React.Component {

    state = {
        userList: {
            userId: "",
            fullName: "",
            address: "",
            email: "",
            status: "pending",
            subTotals: 0,
            startDate: "",
            endDate: "",
            totalItems: "",
            paymentMethod: "",
            deliveryCourier: "",
            deliveryFee: 100000,
            grandTotals: 0,
            allTotalPay: 0,
            // id: 0
        },
        totalPays: 0,
        list: [],
        product: []

    }

    getUserList = () => {
        let totalsUserPay = 0
        Axios.get(`${API_URL}/users`, {
            params: {
                role: "user",
                _embed: "transactions",
            }
        })
            .then((res) => {
                this.setState({ list: res.data })
            })
            .catch((err) => {
                console.log(err);
            });
    }


    getProductList = () => {
        Axios.get(`${API_URL}/products`, {
            params :{
                _embed: "transactions"
            }
        })
        .then((res) => {
            console.log(res.data);
            this.setState({ product: res.data })
            this.state.product.map((val) => {
                Axios.get(`${API_URL}/transactions`, {
                    params: {
                        _embed: "transactionsDetails",
                        productId: val.id
                    }
                })
            })
        })
        .catch((err) => {
            console.log(err);
            
        })
    }

    componentDidMount() {
        this.getUserList()
        this.getProductList()
    }

    renderListData = () => {
        const { list } = this.state
        let totalPayUser = parseInt()
        return list.map((val) => {
            return (
                <tr>
                    <td>{val.id}</td>
                    <td>{val.fullName}</td>
                    <td>
                    {
                        val.transactions.map((val) => {
                            totalPayUser += val.subTotals
                            if ( val.status === "approved" ) {
                                if (val.subTotals.length > 1) {
                                    return totalPayUser
                                } else {
                                    return val.subTotals
                                }
                            } else {
                                return null 
                            }
                        })
                    }
                    </td>
                </tr>
            )
        })
    }

    renderProductList = () => {
        const { product } = this.state
        return product.map((val) => {
            return (
                <tr>
                    <td>{val.id}</td>
                    <td>{val.productName}</td>
                    <td>
                        {/* {
                            val.transactions.map((val) => {
                                totalPayUser += val.subTotals
                                if (val.status === "approved") {
                                    if (val.subTotals.length > 1) {
                                        return totalPayUser
                                    } else {
                                        return val.subTotals
                                    }
                                } else {
                                    return null
                                }
                            })
                        } */}
                    </td>
                </tr>
            )
        })
    }


    render() {
        return (
            <div className = "container py-4" >
                <div className="dashboard">
                    <caption className="p-3">
                        <h2>USER REPORT</h2>
                    </caption>
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <th>User ID</th>
                                <th>Full Name</th>
                                <th>History Total</th>
                               
                            </tr>
                        </thead>
                        <tbody>{this.renderListData()}</tbody>
                    </table>
                </div>
                <div className="dashboard">
                    <caption className="p-3">
                        <h2>PRODUCT REPORT</h2>
                    </caption>
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <th>User ID</th>
                                <th>Product Name</th>
                                <th>History Total</th>

                            </tr>
                        </thead>
                        <tbody>{this.renderProductList()}</tbody>
                    </table>
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        user: state.user,
    }
}
export default connect(mapStateToProps)(AdminReport) 