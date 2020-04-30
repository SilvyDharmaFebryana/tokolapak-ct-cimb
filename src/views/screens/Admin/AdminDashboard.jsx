import React from 'react'
import { Table } from 'reactstrap'
import Axios from 'axios'
import { API_URL } from '../../../constants/API'
import ButtonUI from "../../components/Button/Button"
import TextField from '../../components/TextField/TextField'
import swal from 'sweetalert'

class AdminDashboard extends React.Component {

    state = {
        productDataList: [],
        createForm: {
            productName: "",
            price: "",
            category: "Phone",
            image: "",
            desc: "",
        },
        editForm: {
            id: 0,
            productName: "",
            price: 0,
            category: "",
            image: "",
            desc: "",
        }
    }

    getProductDataList = () => {
        Axios.get(`${API_URL}/products`)
        .then((res) => {
            this.setState({ productDataList: res.data })          
        })
        .catch((err) => {
            console.log(err);          
        })
    }

    componentDidMount() {
        this.getProductDataList()
    }

    inputHandler = (e, field, form) => {
        const { value } = e.target
        this.setState({
            [form]: {
                ...this.state[form],
                [field]: value
            }
        })
    }


    createProductHandler = () => {
        Axios.post(`${API_URL}/products`, this.state.createForm)
        .then((res) => {
            swal("Success", "Item has been added to list product", "success")
            this.setState({ createForm: {
                productName: "",
                price: "",
                category: "Phone",
                image: "",
                desc: "",
            } 
        })
            this.getProductDataList()
        })
        .catch((err) => {
            swal("Error!", "Item could not be added to list product", "error") 
            console.log(err);
               
        })
    }


    editProductHandlerBtn = (idx) => {
        this.setState({
            editForm: {
                ...this.state.productDataList[idx]
            }
        })
    }

    editProductHandler = () => {
        Axios.put(`${API_URL}/products/${this.state.editForm.id}`, this.state.editForm)
        .then((res) => {
            swal("Success", "Item has been edited to list product", "success")
            this.getProductDataList()
            console.log(res); 
        })
        .catch((err) => {
            swal("Error!", "Item could not be edited to list product", "error") 
            console.log(err);
            
        })
    }

    deleteProductHandler = (id) => {
        Axios.delete(`${API_URL}/products/${id}`)
            .then((res) => {
                swal("success deleted", "", "success")
                this.getProductDataList()
            })
            .catch((err) => {
                console.log(err);
            });
    };

    renderProductList = (idx) => {
        const { productDataList } = this.state;
        return productDataList.map((val, idx) => {
            return (
                <tr>
                    <td> {idx + 1} </td>
                    <td> {val.productName} </td>
                    <td>
                        {
                            new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(val.price)
                        }
                    </td>
                    <td>{val.category}</td>
                    <td><img className="justify-content-center" style={{ height: "100px", objectFit: "contain" }} src={val.image} alt="" /></td>
                    <td>{val.desc}</td>
                    <td>
                        <ButtonUI onClick={() => this.editProductHandlerBtn(idx)} type="contained">Edit</ButtonUI>
                    </td>
                    <td>
                        <ButtonUI onClick={() => this.deleteProductHandler(val.id)} type="outlined">Delete</ButtonUI>
                    </td>
                </tr>
            );
        });
    }

    render() {
        return (
            <div className="container py-4">
                <div>Admin Dashboard</div>
                <Table responsive>
                    <thead>
                        <tr className="text-center">
                            <th>ID</th>
                            <th>Name</th>
                            <th>Product Price</th>
                            <th>Category</th>
                            <th>Image</th>
                            <th>Description</th>
                            <th colSpan={2}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                            {
                                this.renderProductList()
                            }
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={2}> 
                                <TextField
                                    value={this.state.createForm.productName}
                                    placeholder="Name"
                                    onChange={e => this.inputHandler(e, 'productName', 'createForm')} /> 
                            </td>
                            <td> 
                                <TextField 
                                    value={this.state.createForm.price}
                                    placeholder="Price"
                                    onChange={e => this.inputHandler(e, 'price', 'createForm')} />
                            </td>
                            <td colSpan={2}>
                                <select 
                                    value={this.state.createForm.category}
                                    className="form-control"
                                    onChange={e => this.inputHandler(e, 'category', 'createForm')}
                                >
                                    <option value="Phone">Phone</option>
                                    <option value="Laptop">Laptop</option>
                                    <option value="Tab">Tab</option>
                                    <option value="Desktop">Desktop</option>
                                </select>                               
                            </td>
                            <td> 
                                <TextField 
                                    value={this.state.createForm.image}
                                    placeholder="Image"
                                    onChange={e => this.inputHandler(e, 'image', 'createForm')} />
                            </td>
                            <td colSpan={2}> 
                                <TextField 
                                    value={this.state.createForm.desc}
                                    placeholder="Description" 
                                    onChange={e => this.inputHandler(e, 'desc', 'createForm')}/>
                            </td>
                        </tr>

                        <tr>
                            <td colSpan={7}></td>
                            <td colSpan={1}>
                                <ButtonUI onClick={this.createProductHandler} type="contained">Create</ButtonUI>
                            </td>
                        </tr>

                        <tr>
                            <td colSpan={2}> 
                                <TextField 
                                    value={this.state.editForm.productName}
                                    placeholder="Name"
                                    onChange={e => this.inputHandler(e, 'productName', 'editForm')} /> 
                            </td>
                            <td> 
                                <TextField 
                                    value={this.state.editForm.price}
                                    placeholder="Price"
                                    onChange={e => this.inputHandler(e, 'price', 'editForm')} />
                            </td>
                            <td colSpan={2}>
                                <select 
                                    value={this.state.editForm.category}
                                    className="form-control"
                                    onChange={e => this.inputHandler(e, 'category', 'editForm')}
                                >
                                    <option value="Phone">Phone</option>
                                    <option value="Laptop">Laptop</option>
                                    <option value="Tab">Tab</option>
                                    <option value="Desktop">Desktop</option>
                                </select>                               
                            </td>
                            <td> 
                                <TextField 
                                    value={this.state.editForm.image}
                                    placeholder="Image"
                                    onChange={e => this.inputHandler(e, 'image', 'editForm')} />
                            </td>
                            <td colSpan={2}> 
                                <TextField 
                                    value={this.state.editForm.desc}
                                    placeholder="Description" 
                                    onChange={e => this.inputHandler(e, 'desc', 'editForm')}/>
                            </td>
                        </tr>

                        <tr>
                            <td colSpan={7}></td>
                            <td colSpan={1}>
                                <ButtonUI onClick={this.editProductHandler} type="contained">Save</ButtonUI>
                            </td>
                        </tr>
                    </tfoot>
                </Table>
            </div>
        )
    }
}


export default AdminDashboard