<<<<<<< HEAD
import userTypes from '../types/user'

const { ON_LOGIN_SUCCESS, ON_LOGIN_FAIL, ON_LOGOUT_SUCCESS, ON_REGISTER_FAIL } = userTypes
=======
import userTypes from "../types/user";

const { ON_LOGIN_FAIL, ON_LOGIN_SUCCESS, ON_LOGOUT_SUCCESS } = userTypes;
>>>>>>> b3d57fa4d4c7075e9d991868afaa7eaced7bd92e

const init_state = {
  id: 0,
  username: "",
  fullName: "",
  address: {},
  role: "",
  errMsg: "",
};

export default (state = init_state, action) => {
  switch (action.type) {
    case ON_LOGIN_SUCCESS:
      const { username, fullName, role, id } = action.payload;
      return {
        ...state,
        username,
        fullName,
        role,
        id,
      };
    case ON_LOGIN_FAIL:
      return { ...state, errMsg: action.payload };
<<<<<<< HEAD
    case ON_REGISTER_FAIL:
      return { ...state, errMsg: action.payload };
    case ON_LOGOUT_SUCCESS:
      return { init_state };
    default:
      return { ...state };
  }
  
=======
    case "ON_REGISTER_FAIL":
      return { ...state, errMsg: action.payload };
    case ON_LOGOUT_SUCCESS:
      return { ...init_state };
    default:
      return { ...state };
  }
>>>>>>> b3d57fa4d4c7075e9d991868afaa7eaced7bd92e
};
