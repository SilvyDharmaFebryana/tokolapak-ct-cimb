import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons/";
import {
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
} from "reactstrap";

import { faUser } from "@fortawesome/free-regular-svg-icons";

import "./Navbar.css";
import ButtonUI from "../Button/Button.tsx";
import swal from 'sweetalert'
import { logoutHandler, searchInputHandler, getQuantity } from '../../../redux/actions'
import Axios from "axios";
import { API_URL } from "../../../constants/API";

const CircleBg = ({ children }) => {
  return <div className="circle-bg">{children}</div>;
};

class Navbar extends React.Component {
  state = {
    searchBarIsFocused: false,
    searchBarInput: "",
    dropdownOpen: false,
    qty: 0
  };


  onLogout = () => {
    // cookieObject.remove("authData")
    this.props.logoutHandler()
    swal('anda akan keluar')
  }

  // inputHandler = (event, field) => {
  //   const { value } = event.target;
  //   this.setState({ [field]: value });
  // };


  getQuantityCart = () => {

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
        })
        this.setState({ qty: totalQty })

      })
      .catch((err) => {
        console.log(err);
      })

  }

  showButtonLogout = () => {
    if (this.props.user.id) {
      return (
        <>
          <Dropdown
            toggle={this.toggleDropdown}
            isOpen={this.state.dropdownOpen}
          >
            {
              this.props.user.role === "admin" ? (
                <DropdownMenu className="mt-2">
                  <DropdownItem>
                    <Link
                      style={{ color: "inherit", textDecoration: "none" }}
                      to="/admin/dashboard"
                    >
                      Dashboard
                    </Link>
                  </DropdownItem>
                  <DropdownItem>
                    <Link
                      style={{ color: "inherit", textDecoration: "none" }}
                      to="/admin/member"
                    >
                      Members
                    </Link>
                  </DropdownItem>
                  <DropdownItem><Link
                    style={{ color: "inherit", textDecoration: "none" }}
                    to="/admin/payment"
                  >
                    Payment
                    </Link>
                  </DropdownItem>
                  <DropdownItem>
                    <Link
                      style={{ color: "inherit", textDecoration: "none" }}
                      to="/admin/report"
                    >
                      Report
                    </Link>
                  </DropdownItem>
                </DropdownMenu>
              ) :
                <DropdownMenu className="mt-2">
                  <DropdownItem>
                    <Link
                      style={{ color: "inherit", textDecoration: "none" }}
                      to="/wishlist"
                    >
                      Wishlist
                    </Link>
                  </DropdownItem>
                  <DropdownItem>
                    <Link
                      style={{ color: "inherit", textDecoration: "none" }}
                      to="/history"
                    >
                      History
                    </Link>
                  </DropdownItem>
                </DropdownMenu>
            }

            <DropdownToggle tag="div" className="d-flex">
              <FontAwesomeIcon icon={faUser} style={{ fontSize: 24 }} />
              <p className="small ml-3 mr-4">{this.props.user.username}</p>
            </DropdownToggle>
          </Dropdown>
          <Link
            className="d-flex flex-row"
            to="/cart"
            style={{ textDecoration: "none", color: "inherit" }}
          > 
          {
              this.props.user.role === "user" ? (
                <>
                <FontAwesomeIcon
                  className="mr-2"
                  icon={faShoppingCart}
                  style={{ fontSize: 24 }}
                />
                <CircleBg>
                  <small style={{ color: "#3C64B1", fontWeight: "bold" }}>
                    {
                      this.state.qty
                    }
                  </small>
                </CircleBg>
                </>
              ) : null
          }
          </Link>
          <Link className="ml-4" to="/" style={{ textDecoration: "none", color: "inherit" }} onClick={this.onLogout}><ButtonUI type="contained" >Logout</ButtonUI></Link>
        </>
      )
    } else {
      return (
        <>
          <ButtonUI className="mr-3" type="textual">
            <Link style={{ textDecoration: "none", color: "inherit" }} to="/auth">Sign in</Link>
          </ButtonUI>
          <ButtonUI type="contained"><Link style={{ textDecoration: "none", color: "inherit" }} to="/auth">Sign up</Link></ButtonUI>
        </>
      )
    }
  }


  onFocus = () => {
    this.setState({ searchBarIsFocused: true });
  };

  onBlur = () => {
    this.setState({ searchBarIsFocused: false });
  };

  logoutBtnHandler = () => {
    this.props.onLogout();
    // this.forceUpdate();
  };

  toggleDropdown = () => {
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
  };

  componentDidMount() {

    this.getQuantityCart()
  }

  render() {
    return (
      <div className="d-flex flex-row justify-content-between align-items-center py-4 navbar-container">
        <div className="logo-text">
          <Link style={{ textDecoration: "none", color: "inherit" }} to="/">
            LOGO
          </Link>
        </div>
        <div
          style={{ flex: 1 }}
          className="px-5 d-flex flex-row justify-content-start"
        >
          <input
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            className={`search-bar ${
              this.state.searchBarIsFocused ? "active" : null
              }`}
            type="text"
            placeholder="Cari produk impianmu disini"
            onChange={(e) => this.props.onSearch(e.target.value)}
          />
          {
            console.log(this.props.search.searchInput)

          }

        </div>
        <div className="d-flex flex-row align-items-center">

          {
            this.showButtonLogout()
          }


        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    search: state.search,
    cart: state.cart,
  }
}

const mapDispatchToProps = { //connect function2
  logoutHandler,
  onSearch: searchInputHandler,
  getQty: getQuantity,
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
