import Axios from "axios";
import { API_URL } from "../../constants/API";
import Cookie from "universal-cookie";
import userTypes from '../types/user';
import swal from 'sweetalert'

const { ON_LOGIN_SUCCESS, ON_LOGIN_FAIL, ON_LOGOUT_SUCCESS, ON_REGISTER_FAIL } = userTypes
const cookieObj = new Cookie();


export const loginHandler = (userData) => {
    return (dispatch) => {
        const { username, password } = userData;
        Axios.get(`${API_URL}/users`, {
            params: {
                username,
                password,
            },
        })
            .then((res) => {
                if (res.data.length > 0) {
                    dispatch({
                        type: ON_LOGIN_SUCCESS,
                        payload: res.data[0],
                    });
                    swal("", `Berhasil Login sebagai ${username}`, "success");
                } else {
                    
                    dispatch({
                        type: ON_LOGIN_FAIL,
                        payload: "Username atau password salah",
                    });
                    swal("", 'Password atau username anda salah', "error");
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };
};


export const registerHandler = (userData) => {
    return (dispatch) => {
        const { username, password, repPassword, fullName } = userData;
        Axios.get(`${API_URL}/users`, {
            params: {
                username
            },
        })
            .then((res) => {
                if (res.data.length == 0) {
                    dispatch({
                        type: ON_LOGIN_SUCCESS,
                        payload: res.data
                    })
                    if (repPassword == password) {
                        Axios.post(`${API_URL}/users`, {
                            username,
                            password,
                            repPassword,
                            fullName,
                        })
                            .then((res) => {
                                console.log(res.data);
                                dispatch({
                                    type: ON_LOGIN_SUCCESS,
                                    payload: res.data,
                                });
                                swal('data tersimpan')
                            })
                            .catch((err) => {
                                console.log(err);
                            });
                    } else {
                        swal('', 'password tidak sama', 'error')
                    }
                } else {
                    dispatch({
                        type: ON_REGISTER_FAIL,
                        payload: "username sudah digunakan",
                    });
                    swal("", 'username sudah digunakan', 'error')
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };
};

export const userKeepLogin = (userData) => {
    return (dispatch) => {
        Axios.get(`${API_URL}/users`, {
            params: {
                id: userData.id,
            },
        })
            .then((res) => {
                if (res.data.length > 0) {
                    dispatch({
                        type: ON_LOGIN_SUCCESS,
                        payload: res.data[0],
                    });
                    alert("selamat datang")
                } else {
                    dispatch({
                        type: ON_LOGIN_FAIL,
                        payload: "Username atau password salah",
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };
};

export const logoutHandler = () => {
    cookieObj.remove("authData");
    return {
        type: ON_LOGOUT_SUCCESS,
    };
};


