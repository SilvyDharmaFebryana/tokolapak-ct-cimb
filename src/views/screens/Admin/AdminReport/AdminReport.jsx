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
        // totalPays: 0,
        totalList: [],
        productList: [],
        productYangDiList: []

    }

    getList = () => {
         let totalsUserPay = 0
        Axios.get(`${API_URL}/users`, {
            params: {
                role: "user",
                _embed: "transactions",
            }
        })
            .then((res) => {
                this.setState({ totalList: res.data })
            })
            .catch((err) => {
                console.log(err);
            });

    }


    getProductList = () => {
        Axios.get(`${API_URL}/products`)
            .then((res) => {
                this.setState({ productList: res.data })
                console.log(res.data);

            })
            .catch((err) => {
                console.log(err)
            })

        Axios.get(`${API_URL}/transactions`, {
            params: {
                _embed: "transactionsDetails"
            }
        })
            .then((res) => {
                this.setState({ productYangDiList: res.data })
                console.log(res.data);
            })
            .catch((err) => {
                console.log(err)
            })
       
    }

    componentDidMount() {
        this.getList()
        this.getProductList()
    }

    renderListData = () => {
        const { totalList } = this.state
        let totalPayUser = parseInt()
        return totalList.map((val) => {
            return (
                <tr>
                    <td>{val.id}</td>
                    <td>{val.fullName}</td>
                    <td>
                        {
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
                        }
                    </td>
                </tr>
            )
        })
    }

    renderProductList = () => {
        const { productList } = this.state

        return productList.map((val) => {

            const { productName, id } = val
            const { productYangDiList } = this.state
            let allTotalQuantity = 0

            productYangDiList.map((value) => {
                value.transactionsDetails.map((values) => {
                    if( value.status === "approved" ) {
                        if (values.itemId === id) {
                            allTotalQuantity += values.itemQuantity
                        }
                    }
                })
            })

            return (
                <tr>
                    <td>{id}</td>
                    <td>{productName}</td>
                    <td>
                    {
                        allTotalQuantity > 0 ? (
                            <b>{allTotalQuantity} pcs</b>
                        ) : <p style={{color: "red", fontWeight: "100px"}}>belum ada history</p>
                    }
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