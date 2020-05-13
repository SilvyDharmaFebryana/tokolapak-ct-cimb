// import React from 'react'
// import Axios from 'axios'
// import { API_URL } from '../../../../constants/API'
// import { connect } from 'react-redux'

// class AdminReport extends React.Component {

//     state = {
//         userList: {
//             userId: "",
//             fullName: "",
//             address: "",
//             email: "",
//             status: "pending",
//             subTotals: 0,
//             startDate: "",
//             endDate: "",
//             totalItems: "",
//             paymentMethod: "",
//             deliveryCourier: "",
//             deliveryFee: 100000,
//             grandTotals: 0,
//             allTotalPay: 0,
//             // id: 0
//         },
//         // totalPays: 0,
//         userList: [],
//         totalList: [],
//         productList: [],
//         productYangDiList: []

//     }

//     getList = () => {
//         let totalsUserPay = 0
//         Axios.get(`${API_URL}/users`, {
//             params: {
//                 role: "user",
//                 _embed: "transactions",
//             }
//         })
//             .then((res) => {
//                 this.setState({ totalList: res.data })
//             })
//             .catch((err) => {
//                 console.log(err);
//             });
//     }


//     getProductList = () => {
//         Axios.get(`${API_URL}/products`)
//             .then((res) => {
//                 this.setState({ productList: res.data })
//                 console.log(res.data);

//             })
//             .catch((err) => {
//                 console.log(err)
//             })

//         Axios.get(`${API_URL}/transactions`, {
//             params: {
//                 _embed: "transactionsDetails"
//             }
//         })
//             .then((res) => {
//                 this.setState({ productYangDiList: res.data })
//                 console.log(res.data);
//             })
//             .catch((err) => {
//                 console.log(err)
//             })
       
//     }

//     componentDidMount() {
//         this.getList()
//         this.getProductList()
//     }

//     renderListData = () => {
//         const { totalList } = this.state
//         let totalPayUser = 0
//         return totalList.map((val) => {
//             return (
//                 <tr>
//                     <td>{val.id}</td>
//                     <td>{val.fullName}</td>
//                     <td>
//                         {
//                             val.transactions.map((val) => {
//                                 totalPayUser += parseInt(val.subTotals)
//                                 if (val.status === "approved") {
//                                     if (val.subTotals.length > 1) {
//                                         return totalPayUser
//                                     } else {
//                                         return val.subTotals
//                                     }
//                                 } else {
//                                     return null
//                                 }
//                             })
//                         }
//                     </td>
//                 </tr>
//             )
//         })
//     }

//     renderProductList = () => {

//         const { productList } = this.state

//         return productList.map((val) => {

//             const { productName, id } = val
//             const { productYangDiList } = this.state
//             let allTotalQuantity = 0

//             productYangDiList.map((value) => {
//                 value.transactionsDetails.map((values) => {
//                     if( value.status === "approved" ) {
//                         if (values.itemId === id) {
//                             allTotalQuantity += values.itemQuantity
//                         }
//                     }
//                 })
//             })

//             return (
//                 <tr>
//                     <td>{id}</td>
//                     <td>{productName}</td>
//                     <td>
//                     {
//                         allTotalQuantity > 0 ? (
//                             <b>{allTotalQuantity} pcs</b>
//                         ) : <p style={{color: "red", fontWeight: "100px"}}>belum ada history</p>
//                     }
//                     </td>
//                 </tr>
//             )
//         })
//     }


//     render() {
//         return (
//             <div className = "container py-4" >
//                 <div className="dashboard">
//                     <caption className="p-3">
//                         <h2>USER REPORT</h2>
//                     </caption>
//                     <table className="dashboard-table">
//                         <thead>
//                             <tr>
//                                 <th>User ID</th>
//                                 <th>Full Name</th>
//                                 <th>History Total</th>
                               
//                             </tr>
//                         </thead>
//                         <tbody>{this.renderListData()}</tbody>
//                     </table>
//                 </div>
//                 <div className="dashboard">
//                     <caption className="p-3">
//                         <h2>PRODUCT REPORT</h2>
//                     </caption>
//                     <table className="dashboard-table">
//                         <thead>
//                             <tr>
//                                 <th>User ID</th>
//                                 <th>Product Name</th>
//                                 <th>History Total</th>

//                             </tr>
//                         </thead>
//                         <tbody>{this.renderProductList()}</tbody>
//                     </table>
//                 </div>
//             </div>
//         )
//     }
// }
// const mapStateToProps = (state) => {
//     return {
//         user: state.user,
//     }
// }
// export default connect(mapStateToProps)(AdminReport) 






import React from "react";
import Axios from "axios";
import { API_URL } from '../../../../constants/API'
import ButtonUI from "../../../components/Button/Button";
import swal from "sweetalert";

class AdminReport extends React.Component {
    state = {
        reportType: "user",
        userReportList: [],
        productReportList: [],
    };

    getUserReportList = () => {
        Axios.get(`${API_URL}/transactions`, {
            params: {
                status: "approved",
                _expand: "user",
            },
        })
            .then((res) => {
                // console.log(res.data);
                this.setState({ userReportList: res.data });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    getProductReportList = () => {
        Axios.get(
            `${API_URL}/transactionsDetails?_expand=transaction&_expand=product`
        )
            .then((res) => {
                console.log(
                    res.data.filter((trx) => trx.transaction.status === "approved")
                );
                this.setState({ productReportList: res.data });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    renderUserReportList = () => {
        let userList = [];

        this.state.userReportList.forEach((val) => {
            let findUserIdx = userList.findIndex(
                (user) => user.username === val.user.username
            );

            if (findUserIdx !== -1) {
                // Check apakah user sudah tertampung
                // Belom ada = -1
                // !== -1 -> sudah ada
                userList[findUserIdx].total += val.subTotals;
            } else {
                userList.push({
                    username: val.user.username,
                    total: val.subTotals,
                });
            }
        });

        return userList.map((val) => {
            return (
                <tr>
                    <td>{val.username}</td>
                    <td>{val.total}</td>
                </tr>
            );
        });
    };

    renderProductReportList = () => {
        let productList = [];

        this.state.productReportList
            .filter((trx) => trx.transaction.status === "approved")
            .forEach((val) => {
                let findProductIdx = productList.findIndex(
                    (item) => item.productName === val.product.productName
                );

                if (findProductIdx !== -1) {
                    productList[findProductIdx].total += val.itemQuantity;
                } else {
                    productList.push({
                        productName: val.product.productName,
                        total: val.itemQuantity,
                    });
                }
            });

        return productList.map((val) => {
            return (
                <tr>
                    <td>{val.productName}</td>
                    <td>{val.total}</td>
                </tr>
            );
        });
    };

    componentDidMount() {
        this.getUserReportList();
        this.getProductReportList();
    }

    render() {
        return (
            <div className="container py-4">
                <div className="row">
                    <div className="col-12">
                        <div className="dashboard">
                            <caption className="p-3">
                                <h2>Report</h2>
                            </caption>
                            <div className="d-flex flex-row ml-3 mb-3">
                                <ButtonUI
                                    className={`auth-screen-btn ${
                                        this.state.reportType == "user" ? "active" : null
                                        }`}
                                    type="outlined"
                                    onClick={() => this.setState({ reportType: "user" })}
                                >
                                    User
                                </ButtonUI>
                                <ButtonUI
                                    className={`ml-3 auth-screen-btn ${
                                        this.state.reportType == "product" ? "active" : null
                                        }`}
                                    type="outlined"
                                    onClick={() => this.setState({ reportType: "product" })}
                                >
                                    Product
                                </ButtonUI>
                            </div>
                            <table className="dashboard-table">
                                <thead>
                                    <tr>
                                        <th>
                                            {this.state.reportType === "user"
                                                ? "Username"
                                                : "Product"}
                                        </th>
                                        <th>
                                            {this.state.reportType === "user"
                                                ? "Total Spending"
                                                : "Total Item Sold"}{" "}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.reportType === "user"
                                        ? this.renderUserReportList()
                                        : this.renderProductReportList()}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AdminReport;