import React from "react";
import "./AdminMember.css";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import Axios from "axios";

import { API_URL } from "../../../../constants/API";

import ButtonUI from "../../../components/Button/Button";
import TextField from "../../../components/TextField/TextField";

import swal from "sweetalert";

class AdminMember extends React.Component {
    state = {
        memberList: [],
        createUserForm: {
            id: 0,
            username: "",
            email: "",
            address: "",
            fullName: "",
            password: "",
            role: "admin",
            showPassword: false,
        },
        editUserForm: {
            id: 0,
            username: "",
            email: "",
            address: "",
            fullName: "",
            password: "",
            role: "admin",
            showPassword: false,
        
        },
        activeProducts: [],
        modalOpen: false,
    };

    getUserList = () => {
        Axios.get(`${API_URL}/users`)
            .then((res) => {
                this.setState({ memberList: res.data });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    checkboxHandler = (e, form) => {
        const { checked } = e.target

        this.setState({
            [form]: {
                ...this.state[form],
                showPassword: checked,
            }
        })

    }

    deleteDataHandler = (id) => {
        Axios.delete(`${API_URL}/users/${id}`)
            .then((res) => {
                this.getProductList()
            })
        swal("Succes!", "user has been deleted", "success")
            .catch((err) => {
                console.log(err);
            });
    };

    renderMemberList = () => {
        return this.state.memberList.map((val, idx) => {
            const { 
                id,
                username,
                fullName,
                address,
                email,
                role, } = val;

            return (
                <>
                    <tr
                        onClick={() => {
                            if (this.state.activeProducts.includes(idx)) {
                                this.setState({
                                    activeProducts: [
                                        ...this.state.activeProducts.filter((item) => item !== idx),
                                    ],
                                });
                            } else {
                                this.setState({
                                    activeProducts: [...this.state.activeProducts, idx],
                                });
                            }
                        }}
                    >
                        <td> {id} </td>
                        <td> {username} </td>
                        <td> {fullName} </td>
                    </tr>
                    <tr
                        className={`collapse-item ${
                            this.state.activeProducts.includes(idx) ? "active" : null
                            }`}
                    >
                        <td className="" colSpan={3}>
                            <div className="d-flex justify-content-around align-items-center">
                                <div className="d-flex">
                                    <div className="d-flex flex-column ml-4 justify-content-center">
                                        <h5>{fullName}</h5>
                                        <h6>{email}</h6>
                                        <h6>{address}</h6>
                                        <h6>{role}</h6>
                                       
                                    </div>
                                </div>
                                <div className="d-flex flex-column align-items-center">
                                    <ButtonUI
                                        onClick={() => this.editBtnHandler(idx)}
                                        type="contained"
                                    >
                                        Edit
                                    </ButtonUI>
                                    <ButtonUI
                                        onClick={() => this.deleteDataHandler(val.id)}
                                        className="mt-3" type="textual">
                                        Delete
                                    </ButtonUI>
                                </div>
                            </div>
                        </td>
                    </tr>
                </>
            );
        });
    };

    inputHandler = (e, field, form) => {
        let { value } = e.target;
        this.setState({
            [form]: {
                ...this.state[form],
                [field]: value,
            },
        });
    };

    createUserHandler = () => {
        const { username } = this.state.createUserForm
        Axios.get(`${API_URL}/users`, {
            params: {
                username
            }
        })
        .then((res) => {
            if (res.data.length > 0) {
                swal("username has used")
            } else {
                Axios.post(`${API_URL}/users`, this.state.createUserForm)
                    .then((res) => {
                        swal("Success!", "User has been added to the list", "success");
                        this.setState({
                            createUserForm: {
                                username: "",
                                email: "",
                                address: "",
                                fullName: "",
                                password: "",
                                role: "user",
                            },
                        });
                        this.getUserList();
                    })
                    .catch((err) => {
                        swal("Error!", "User could not be added to the list", "error");
                    });
            }
        })
        .catch((err) => {
            console.log(err);
            
        })
       
    };

    editBtnHandler = (idx) => {
        this.setState({
            editUserForm: {
                ...this.state.memberList[idx],
            },
            modalOpen: true,
        });
    };

    editUserHandler = () => {
        Axios.put(
            `${API_URL}/users/${this.state.editUserForm.id}`,
            this.state.editUserForm
        )
            .then((res) => {
                swal("Success!", "User has been edited", "success");
                this.setState({ modalOpen: false });
                this.getUserList();
            })
            .catch((err) => {
                swal("Error!", "User could not be edited", "error");
                console.log(err);
            });
    };
    toggleModal = () => {
        this.setState({ modalOpen: !this.state.modalOpen });
    };
    componentDidMount() {
        this.getUserList()
    }
    render() {
        return (
            <div className="container py-4">
                <div className="dashboard">
                    <caption className="p-3">
                        <h2>Products</h2>
                    </caption>
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>{this.renderMemberList()}</tbody>
                    </table>
                </div>
                <div className="dashboard-form-container p-4">
                    <caption className="mb-4 mt-2">
                        <h2>Add Product</h2>
                    </caption>
                    <div className="row">
                        <div className="col-8">
                            <TextField
                                value={this.state.createUserForm.fullName}
                                placeholder="Full Name"
                                onChange={(e) =>
                                    this.inputHandler(e, "fullName", "createUserForm")
                                }
                            />
                        </div>
                        <div className="col-4">
                            <TextField
                                value={this.state.createUserForm.username}
                                placeholder="username"
                                onChange={(e) => this.inputHandler(e, "username", "createUserForm")}
                            />
                        </div>
                        <div className="col-12 mt-3">
                            <textarea
                                value={this.state.createUserForm.address}
                                onChange={(e) => this.inputHandler(e, "address", "createUserForm")}
                                style={{ resize: "none" }}
                                placeholder="Address"
                                className="custom-text-input"
                            ></textarea>
                        </div>
                        <div className="col-6 mt-3">
                            <TextField
                                value={this.state.createUserForm.email}
                                placeholder="Email"
                                onChange={(e) => this.inputHandler(e, "email", "createUserForm")}
                            />
                        </div>
                        <div className="col-6 mt-3">
                            <select
                                value={this.state.createUserForm.role}
                                className="custom-text-input h-100 pl-3"
                                onChange={(e) => this.inputHandler(e, "role", "createUserForm")}
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div className="col-9 mt-3">
                            <TextField
                                value={this.state.createUserForm.password}
                                placeholder="Password"
                                onChange={(e) => this.inputHandler(e, "password", "createUserForm")}
                                type={this.state.createUserForm.showPassword ? "text" : "password"}
                            />
                        </div>
                        <div className="col-3 mt-3">
                            <input
                                type="checkbox"
                                className="mt-3 mr-1"
                                name="showPasswordCreateUser"
                                onChange={e => this.checkboxHandler(e, 'createUserForm')}
                            /> Show Password
                        </div>
                        <div className="col-3 mt-3">
                            <ButtonUI onClick={this.createUserHandler} type="contained">
                                Create Product
              </ButtonUI>
                        </div>
                    </div>
                </div>


                
                <Modal
                    toggle={this.toggleModal}
                    isOpen={this.state.modalOpen}
                    className="edit-modal"
                >
                    <ModalHeader toggle={this.toggleModal}>
                        <caption>
                            <h3>Edit Product</h3>
                        </caption>
                    </ModalHeader>
                    <ModalBody>
                        <div className="row">
                            <div className="col-8">
                                <TextField
                                    value={this.state.editUserForm.fullName}
                                    placeholder="Full Name"
                                    onChange={(e) =>
                                        this.inputHandler(e, "fullName", "editUserForm")
                                    }
                                />
                            </div>
                            <div className="col-4">
                                <TextField
                                    value={this.state.editUserForm.username}
                                    placeholder="Username"
                                    onChange={(e) => this.inputHandler(e, "username", "editUserForm")}
                                />
                            </div>
                            <div className="col-12 mt-3">
                                <textarea
                                    value={this.state.editUserForm.address}
                                    onChange={(e) => this.inputHandler(e, "address", "editUserForm")}
                                    style={{ resize: "none" }}
                                    placeholder="Address"
                                    className="custom-text-input"
                                ></textarea>
                            </div>
                            <div className="col-6 mt-3">
                                <TextField
                                    value={this.state.editUserForm.email}
                                    placeholder="Email"
                                    onChange={(e) => this.inputHandler(e, "email", "editUserForm")}
                                />
                            </div>
                            <div className="col-6 mt-3">
                                <select
                                    value={this.state.editUserForm.role}
                                    className="custom-text-input h-100 pl-3"
                                    onChange={(e) => this.inputHandler(e, "role", "editUserForm")}
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="col-8 text-center my-3">
                                <TextField
                                    value={this.state.editUserForm.password}
                                    placeholder="Password"
                                    onChange={(e) => this.inputHandler(e, "password", "editUserForm")}
                                    type={this.state.editUserForm.showPassword ? "text" : "password"}
                                />
                            </div>
                            <div className="col-4 text-center my-3">
                                <input
                                    type="checkbox"
                                    className="mt-3"
                                    name="showPasswordCreateUser"
                                    onChange={e => this.checkboxHandler(e, 'editUserForm')}
                                /> Show Password
                            </div>
                            <div className="col-5 mt-3 offset-1">
                                <ButtonUI
                                    className="w-100"
                                    onClick={this.toggleModal}
                                    type="outlined"
                                >
                                    Cancel
                                </ButtonUI>
                            </div>
                            <div className="col-5 mt-3">
                                <ButtonUI
                                    className="w-100"
                                    onClick={this.editUserHandler}
                                    type="contained"
                                >
                                    Save
                                </ButtonUI>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}
export default AdminMember;