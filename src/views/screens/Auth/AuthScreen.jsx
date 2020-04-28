import React from "react";
import TextField from "../../components/TextField/TextField";
import ButtonUI from "../../components/Button/Button";
import { connect } from "react-redux";
import { loginHandler, registerHandler } from "../../../redux/actions";

class AuthScreen extends React.Component {

  state = {
    isCondition: true,
    username: "",
    password: "",
    fullName: "",
    email: "",
    repPassword: "",
    user: [],

  }

  isLoginHandler = () => {
    this.setState({ isCondition: true })
  }

  isRegisterHandler = () => {
    this.setState({ isCondition: false })
  }


  inputHandler = (e, field) => {
    const { value } = e.target
    this.setState({ [field]: value });
  };

  registerPostDataHandler = () => {

    const { username, password, repPassword, address, fullName } = this.state;

    const userData = {
      username,
      password,
      address,
      fullName,
      repPassword,
    }
    this.props.onRegis(userData)

  }

  loginDataHandler = () => {

    const { username, password } = this.state

    const userData = {
      username,
      password,
    };
    this.props.onLogin(userData)
  }


  render() {
    return (
      <div className="container">
        {
          (this.state.isCondition) ? (
            <div className="container">
              <div className="row">
                <ButtonUI type="auth" className="mt-3 m-3" onClick={this.isRegisterHandler}>Register</ButtonUI>
                <ButtonUI type="auth" className="mt-3 m-3" onClick={this.isLoginHandler} style={{ backgroundColor: "#373F41", color: "#FFFFFF" }}>Login</ButtonUI>
              </div>
              <div className="row mt-5">
                <div className="col-5">
                  <div>
                    <h3>Log In</h3>
                    <p className="mt-4">
                      Welcome back.
                      <br />
                      Please, login to your account
                    </p>
                    <TextField placeholder="Username" className="mt-5" onChange={(e) => this.inputHandler(e, "username")}/>
                    <TextField placeholder="Password" className="mt-2" onChange={(e) => this.inputHandler(e, "password")}/>
                    <div className="d-flex justify-content-center">
                      <ButtonUI type="contained" className="mt-4" onClick={this.loginDataHandler}>
                        Login
                      </ButtonUI>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) :
            <div className="container">
              <div className="row">
                <ButtonUI type="auth" className="mt-3 m-3" onClick={this.isRegisterHandler} style={{ backgroundColor: "#373F41", color: "#FFFFFF" }}>Register</ButtonUI>
                <ButtonUI type="auth" className="mt-3 m-3" onClick={this.isLoginHandler}>Login</ButtonUI>
              </div>
              <div className="row mt-5">
                <div className="col-5">
                  <div>
                    <h3>Register</h3>
                    <p className="mt-4">
                      You will get the best recommendation for rent house in near of you
                    </p>
                    <TextField placeholder="Fullname" className="mt-5" onChange={(e) => this.inputHandler(e, "fullName")} />
                    <TextField placeholder="Username" className="mt-2" onChange={(e) => this.inputHandler(e, "username")} />
                    <TextField placeholder="Address" className="mt-2" onChange={(e) => this.inputHandler(e, "address")} />
                    <TextField placeholder="Password" className="mt-2" onChange={(e) => this.inputHandler(e, "password")} />
                    <TextField placeholder="Confirm Password" className="mt-2" onChange={(e) => this.inputHandler(e, "repPassword")} />
                    <div className="d-flex justify-content-center">
                      <ButtonUI type="contained" className="mt-4" onClick={this.registerPostDataHandler}>
                        Register
                    </ButtonUI>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        }
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    user: state.user
  };
};

const mapDispatchToProps = {
  onRegis: registerHandler,
  onLogin: loginHandler,
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthScreen);

