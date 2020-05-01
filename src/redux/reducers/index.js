import { combineReducers } from "redux";
import userReducer from "./user";
import search from "./search"
import Axios from 'axios'

export default combineReducers({
  user: userReducer,
  search: search
});
