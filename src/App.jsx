import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import Cookie from "universal-cookie";
import { connect } from "react-redux";

import "./App.css";
import "bootstrap/dist/css/bootstrap.css";

import Home from "./views/screens/Home/Home";
import Navbar from "./views/components/Navbar/Navbar";
import AuthScreenNew from "./views/screens/Auth/AuthScreenNew";
import ProductDetails from "./views/screens/ProductDetails/ProductDetails";
import PageNotFound from "./views/screens/NotFound/PageNotFound";

import Cart from "./views/screens/Cart/Cart";
import AdminDashboard from "./views/screens/Admin/AdminDashboard";
import { userKeepLogin, cookieChecker } from "./redux/actions";
import AdminMember from "./views/screens/Admin/AdminMember/AdminMember";
import AdminPayment from "./views/screens/Admin/Admin Payment/AdminPayment";
import History from "./views/screens/History/History";
import Wishlist from "./views/screens/Wishlist/WishList";
import AdminReport from "./views/screens/Admin/AdminReport/AdminReport";


const cookieObj = new Cookie();

class App extends React.Component {
  
  componentDidMount() {
    setTimeout(() => {
      let cookieResult = cookieObj.get("authData", { path: "/" }); //supaya dapet cookie nya sesuai
      if (cookieResult) { //cek apakah ada cookie 
        this.props.keepLogin(cookieResult);
      } else {
        this.props.cookieChecker();
      }
    }, 1000);
  }

  renderAdminRoutes = () => {
    if (this.props.user.role === "admin") {
      return <Route exact path="/admin/dashboard" component={AdminDashboard} />;
    } else if (this.props.user.role === "user") {
      return <Route path="/admin/dashboard" component={PageNotFound} />
    } else if (this.props.user.role === "user") {
      return <Route path="/admin/payment" component={PageNotFound} />
    } else if (this.props.user.role === "user") {
      return <Route path="/admin/member" component={PageNotFound} />
    } else if (this.props.user.role === "user") {
      return <Route path="/admin/report" component={PageNotFound} />
    } else {
      return <Route path="/" component={Home} />
    }
  };

  render() {
    if (this.props.user.cookieChecked) { // ini cek apakah sudah ada isi 
      console.log(this.props.user.id)
      return (
        <>
          <Navbar />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/auth" component={AuthScreenNew} />
            <Route exact path="/cart" component={Cart} />
            <Route exact path="/admin/member" component={AdminMember} />
            <Route exact path="/admin/payment" component={AdminPayment} />
            <Route exact path="/admin/report" component={AdminReport} />

            <Route exact path="/history" component={History} />
            <Route exact path="/wishlist" component={Wishlist} />
            {this.renderAdminRoutes()}
            <Route exact path="/product/:productId" component={ProductDetails} />
          </Switch>
          <div style={{ height: "120px" }} />
        </>
      );
    } else {
      return <div>Loading ...</div>
    }

  }
}
   



const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = {
  keepLogin: userKeepLogin,
  cookieChecker,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));

/**
 * PR
 * 1. Add to cart, jika barang double, qty yg akan bertambah
 * 2. Di Home, ketika click PHONE/LAPTOP/TAB/DESKTOP
 * 3. Di navbar, ketika ketik, secara otomatis filter products
 * 4. Di cart, buat button checkout, serta dengan proses checkout
 * 5. Ketika confirm checkout, lakukan POST request ke db.json ke transaction
 *    -> lalu cart harus kosong
 */
