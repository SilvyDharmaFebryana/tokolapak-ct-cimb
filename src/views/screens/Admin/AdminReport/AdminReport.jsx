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


    }

    getUserList = () => {
        let totalsUserPay = 0
        Axios.get(`${API_URL}/users`, {
            params: {
                // userId,
                _embed: "transactions",
            }
        })
            .then((res) => {
                this.setState({ list: res.data })
                console.log(res.data);

            })
            .catch((err) => {
                console.log(err);
            });
    }


    componentDidMount() {
        this.getUserList()
    }

    renderListData = () => {
        const { list } = this.state
        return list.map((val) => {
            return (
                <tr>
                    <td>{val.id}</td>
                    <td>{val.fullName}</td>
                    <td>{
                        val.transactions.map((val) => {
                            return (
                                <p>{val.subTotals += val.subTotals}</p>
                            )
                        })
                    }</td>
                </tr>
            )
        })
    }


    render() {
        return (
            <div>
                <div className="ml-5">
                    <center>
                        <table>
                            <thead>
                                <tr>
                                    <th>USER ID</th>
                                    <th>Fullname</th>
                                    <th>History Totals</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.renderListData()
                                }
                            </tbody>
                        </table>
                    </center>
                    
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