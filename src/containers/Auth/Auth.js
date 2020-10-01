import React, { Component } from "react";
import Input from "../../components/UI/Input/Input";
import Button from "../../components/UI/Button/Button";
import produce from "immer";
import classes from "./Auth.module.css";
import { signup, signin, signinRefreshed, signupRefreshed } from "./AuthSlice";
import { connect } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import Spinner from "../../components/UI/Spinner/Spinner";
import { Redirect } from "react-router-dom";

class Auth extends Component {
  state = {
    controls: {
      email: {
        elementType: "input",
        elementConfig: {
          type: "email",
          placeholder: "Mail address",
        },
        value: "",
        validation: {
          required: true,
          isEmail: true,
        },
        valid: false,
        touched: false,
      },
      password: {
        elementType: "input",
        elementConfig: {
          type: "password",
          placeholder: "Password",
        },
        value: "",
        validation: {
          required: true,
          minLength: 7,
        },
        valid: false,
        touched: false,
      },
    },
    isSignup: true,
  };

  checkValidity = (value, rules) => {
    let isValid = true;

    if (!rules) {
      return true;
    }

    if (rules.required) {
      isValid = value.trim() !== "" && isValid;
    }

    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid;
    }

    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid;
    }

    if (rules.isEmail) {
      const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      isValid = pattern.test(value) && isValid;
    }

    if (rules.isNumeric) {
      const pattern = /^\d+$/;
      isValid = pattern.test(value) && isValid;
    }

    return isValid;
  };

  handleInputChange = (inputIdentifier, event) => {
    const isInputValid = this.checkValidity(
      event.target.value,
      this.state.controls[inputIdentifier].validation
    );

    const updatedControls = produce(this.state.controls, (draft) => {
      draft[inputIdentifier].value = event.target.value;
      draft[inputIdentifier].valid = isInputValid;
      draft[inputIdentifier].touched = true;
    });

    const formIsValid = Object.keys(updatedControls).reduce((isValid, e) => {
      return updatedControls[e].valid && isValid;
    }, true);

    this.setState({
      controls: updatedControls,
      formIsValid: formIsValid,
    });
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    try {
      let actionResult = null;
      if (this.state.isSignup && this.props.signupStatus === "idle") {
        actionResult = await this.props.signup(
          this.state.controls.email.value,
          this.state.controls.password.value
        );
      } else if (!this.state.isSignup && this.props.signinStatus === "idle") {
        actionResult = await this.props.signin(
          this.state.controls.email.value,
          this.state.controls.password.value
        );
      }
      unwrapResult(actionResult); // !important (try-catch cannot work without this line)
      if (!this.state.isSignup) {
        this.props.history.push(
          this.props.isBuildingBurger ? "/checkout" : "/"
        );
      }
    } catch (err) {
      console.log(err);
    } finally {
      this.props.signinRefreshed();
      this.props.signupRefreshed();
    }
  };

  handleSwitchAuthModel = () => {
    this.setState((prevState) => {
      return { isSignup: !prevState.isSignup };
    });
  };

  render() {
    const formElementArray = [];
    for (let key in this.state.controls) {
      formElementArray.push({
        id: key,
        config: this.state.controls[key],
      });
    }

    const form = formElementArray.map((formElement) => (
      <Input
        key={formElement.id}
        elementType={formElement.config.elementType}
        elementConfig={formElement.config.elementConfig}
        value={formElement.config.value}
        onChange={this.handleInputChange.bind(this, formElement.id)}
        invalid={!formElement.config.valid}
        shouldValidate={formElement.config.validation}
        touched={formElement.config.touched}
      />
    ));

    const errorMessage = this.props.error ? (
      <p>{this.props.error.message}</p>
    ) : null;

    let authRedirect = null;
    if (this.props.isAuthenticated) {
      authRedirect = <Redirect to="/" />;
    }

    return (
      <div className={classes.Auth}>
        {authRedirect}
        <form onSubmit={this.handleSubmit}>
          {form}
          {errorMessage}
          {this.props.signupStatus === "loading" ||
          this.props.signinStatus === "loading" ? (
            <Spinner />
          ) : (
            <Button btnType="Success">SUBMIT</Button>
          )}
        </form>
        <Button onClick={this.handleSwitchAuthModel} btnType="Danger">
          SWITCH TO {this.state.isSignup ? "SIGN IN" : "SIGN UP"}
        </Button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    signupStatus: state.auth.signupStatus,
    error: state.auth.signupError
      ? state.auth.signupError
      : state.auth.signinError,
    signinStatus: state.auth.signinStatus,
    isAuthenticated: state.auth.token !== null,
    isBuildingBurger: state.burgerBuilder.totalPrice > 0,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signup: (email, password) => dispatch(signup({ email, password })),
    signin: (email, password) => dispatch(signin({ email, password })),
    signupRefreshed: () => dispatch(signupRefreshed()),
    signinRefreshed: () => dispatch(signinRefreshed()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
