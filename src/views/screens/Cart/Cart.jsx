import React from 'react'
import "./Cart.css"
import { connect } from 'react-redux'
import Axios from 'axios'
import { API_URL } from '../../../constants/API'
import ButtonUI from '../../components/Button/Button'

class Cart extends React.Component {

    state = {
        listProductCart: []
    };

    deleteItemInCart = (deleteIndex) => {

        // let deleteCartData = this.state.listProductCart[deleteIndex].id

        this.state.listProductCart.splice(deleteIndex, 1)
        this.renderCartData(this.state.listProductCart)

        // let inCart = arrCart.find((value) => value.id == deleteCartData)
        
        // if (inCart) {
        //     let index = arrCart.findIndex((value) => value.id == inCart.id)
        //     arrCart.splice(index, 1)
        // }
        // renderCart()
    }


    componentDidMount() {
        Axios.get(`${API_URL}/cart`, {
            params: {
                userId: this.props.user.id,
                _expand: "product" 
            }
        })
        .then((res) => {
            console.log(res.data);
            this.setState ({ listProductCart:  res.data })
            
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
                    <td> {val.product.productName} </td>
                    <td> {val.quantity} </td>
                    <td><ButtonUI type="contained" onClick={this.deleteItemInCart}>Delete</ButtonUI></td>
                </tr>
            );
        });
    };

    render() {
        return (
            <div className="container">
                <table className="table table-striped" style={{ width: "80%" }}>
                    <thead>
                    <tr>
                        <th scope="col">No</th>
                        <th scope="col">Product Name</th>
                        <th scope="col">Qty</th>
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
