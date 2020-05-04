import { combineReducers } from "redux";
import userReducer from "./user";
import search from "./search"
import cart from './cart'
import Axios from 'axios'

export default combineReducers({
  user: userReducer,
  search: search,
  cart: cart
});
