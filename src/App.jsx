import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";

import "./App.css";
import "bootstrap/dist/css/bootstrap.css";

import Home from "./views/screens/Home/Home";
import Navbar from "./views/components/Navbar/Navbar";
<<<<<<< HEAD
import AuthScreen from "./views/screens/Auth/AuthScreens";
=======
import AuthScreen from "./views/screens/Auth/AuthScreen";
>>>>>>> b3d57fa4d4c7075e9d991868afaa7eaced7bd92e

class App extends React.Component {
  render() {
    return (
      <>
        <Navbar />
        <Switch>
          <Route exact path="/" component={Home} />
<<<<<<< HEAD
          <Route exact path="/auth" component={AuthScreen}/>
=======
          <Route exact path="/auth" component={AuthScreen} />
>>>>>>> b3d57fa4d4c7075e9d991868afaa7eaced7bd92e
        </Switch>
        <div style={{ height: "120px" }} />
      </>
    );
  }
}

export default withRouter(App);
