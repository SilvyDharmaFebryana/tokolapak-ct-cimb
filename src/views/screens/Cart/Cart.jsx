import React from 'react'
import "./Cart.css"
import { connect } from 'react-redux'
import Axios from 'axios'
import { API_URL } from '../../../constants/API'
import ButtonUI from '../../components/Button/Button'
import swal from 'sweetalert'

class Cart extends React.Component {

    state = {
        listProductCart: [],
        listCart: {
            id: 0,
            productName:"",
            quantity:"",
        }

    };

    deleteDataHandler = (id) => {
        Axios.delete(`${API_URL}/cart/${id}`)
            .then((res) => {
                console.log(res);
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

    renderCartData = () => {
        const { listProductCart } = this.state;
        return listProductCart.map((val, idx) => {
            return (
                <tr>
                    <td> {idx + 1} </td>
                    <td style={{ width: "30%" }}><img className="justify-content-center" style={{ width: "10%" }} src={val.product.image} alt="" /></td>
                    <td> {val.product.productName} </td>
                    <td> {val.quantity} </td>
                    <td><ButtonUI type="contained" onClick={() => this.deleteDataHandler(val.id)} >Delete</ButtonUI></td>
                </tr>
            );
        });
    };

    render() {
        return (
            <div className="container">
                <table className="table table-striped text-align-center" style={{ width: "80%" }} >
                    <thead>
                    <tr>
                        <th scope="col">No</th>
                        <th scope="col">Product</th>
                        <th scope="col">Product Name</th>
                        <th scope="col">Qty</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.renderCartData()
                    }
                </tbody>
                </table>
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
