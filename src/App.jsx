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
import { userKeepLogin, cookieChecker } from "./redux/actions";
import Cart from "./views/screens/Cart/Cart";

const cookieObj = new Cookie();

class App extends React.Component {
  componentDidMount() {
    setTimeout(() => {
      let cookieResult = cookieObj.get("authData");
      if (cookieResult) {
        this.props.keepLogin(cookieResult);
      } else {
        this.props.cookieChecker();
      }   
    }, 2000);
  }

  render() {
    if (this.props.user.cookieChecked) {
      console.log(this.props.user.id)
      return (
        <>
          <Navbar />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/auth" component={AuthScreenNew} />
            <Route exact path="/cart" component={Cart} />
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
