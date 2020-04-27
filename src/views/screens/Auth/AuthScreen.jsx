import React from "react";
import TextField from "../../components/TextField/TextField";
import ButtonUI from "../../components/Button/Button";

class AuthScreen extends React.Component {




  loginHandler = () => {
    return (
      <div className="row mt-5">
        <div className="col-5">
          <div>
            <h3>Log In</h3>
            <p className="mt-4">
              Welcome back.
                <br />
              Please, login to your account
              </p>
            <TextField placeholder="Username" className="mt-5" />
            <TextField placeholder="Password" className="mt-2" />
            <div className="d-flex justify-content-center">
              <ButtonUI type="contained" className="mt-4">
                Login
                </ButtonUI>
            </div>
          </div>
        </div>
        <div className="col-7">Picture</div>
      </div>
    )
  }

  registerHandler = () => {
    return (
      <div className="row mt-5">
        <div className="col-5">
          <div>
            <h3>Register</h3>
            <p className="mt-4">
              You will get the best recommendation for rent house in near of you
              </p>
            <TextField placeholder="Username" className="mt-5" />
            <TextField placeholder="Email" className="mt-2" />
            <TextField placeholder="Password" className="mt-2" />
            <TextField placeholder="Confirm Password" className="mt-2" />
            <div className="d-flex justify-content-center">
              <ButtonUI type="contained" className="mt-4">
                Register
                </ButtonUI>
            </div>
          </div>
        </div>
        <div className="col-7">Picture</div>
      </div>
    )
  }

  buttonAuth = () => {

    let register = <ButtonUI type="auth" className="mt-3 m-3">Register</ButtonUI>
    let login = <ButtonUI type="auth" className="mt-3 m-3">Login</ButtonUI>

    if (register) {
      return (
        this.registerHandler()
      )
    } else if (login) {
      return (
        this.loginHandler()
      )
    }


  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <ButtonUI type="auth" className="mt-3 m-3" onClick={this.registerHandler}>Register</ButtonUI>
          <ButtonUI type="auth" className="mt-3 m-3" onClick={this.loginHandler}>Login</ButtonUI>
        </div>
        <div>
          {
            this.buttonAuth()
          }
        </div>

        {/* <div className="row mt-5">
          <div className="col-5">
            <div>
              <h3>Log In</h3>
              <p className="mt-4">
                Welcome back.
                <br /> 
                Please, login to your account
              </p>
              <TextField placeholder="Username" className="mt-5" />
              <TextField placeholder="Password" className="mt-2" />
              <div className="d-flex justify-content-center">
                <ButtonUI type="contained" className="mt-4">
                  Login
                </ButtonUI>
              </div>
            </div>
          </div>
          <div className="col-7">Picture</div>
        </div>

        <div className="row mt-5">
          <div className="col-5">
            <div>
              <h3>Register</h3>
              <p className="mt-4">
                You will get the best recommendation for rent house in near of you
              </p>
              <TextField placeholder="Username" className="mt-5" />
              <TextField placeholder="Email" className="mt-2" />
              <TextField placeholder="Password" className="mt-2" />
              <TextField placeholder="Confirm Password" className="mt-2" />
              <div className="d-flex justify-content-center">
                <ButtonUI type="contained" className="mt-4">
                  Register
                </ButtonUI>
              </div>
            </div>
          </div>
          <div className="col-7">Picture</div>
        </div> */}
      </div>
    );
  }
}

export default AuthScreen;
