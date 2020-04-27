import { combineReducers } from "redux";
import userReducer from "./user";
import Axios from 'axios'

export default combineReducers({
  user: userReducer,
});
