import Axios from "axios";
import { API_URL } from "../../constants/API";

export const getQuantity = (cartData) => {
    return (dispatch) => {
        // const { quantity } = cartData;
        let totalQty = 0
        Axios.get(`${API_URL}/cart`, {
            params: {
                userId: this.props.user.id,
                _expand: "product"
            }
        })
            .then((res) => {
                res.data.map((val) => {
                    totalQty += val.quantity
                
                dispatch({
                    type: "GET_QUANTITY",
                    payload: totalQty,
                });
                console.log(res.data);
                })
            })
            .catch((err) => {
                console.log(err);
            })
    }
}

// Axios.get(`${API_URL}/cart`, {
//     params: {
//         userId: this.props.user.id,
//         _expand: "product"
//     }
// })
//     .then((res) => {
//         res.data.map((val) => {
//             totalQty += val.quantity
//         })
//         this.setState({ qty: totalQty })

//     })
//     .catch((err) => {
//         console.log(err);
//     })