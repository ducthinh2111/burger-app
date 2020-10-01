import React, { Component } from "react";
import Layout from "./hoc/Layout/Layout";
import BurgerBuilder from "./containers/BurgerBuilder/BurgerBuilder";
import Checkout from "./containers/Checkout/Checkout";
import { Redirect, Route, Switch, withRouter } from "react-router-dom";
import Orders from "./containers/Orders/Orders";
import Auth from "./containers/Auth/Auth";
import ErrorHandler from "./components/ErrorHandler/ErrorHandler";
import Logout from "./containers/Auth/Logout/Logout";
import { connect } from "react-redux";
import { authCheck } from "./containers/Auth/AuthSlice";
import { unwrapResult } from "@reduxjs/toolkit";

class App extends Component {
  async componentDidMount() {
    try {
      const actionResult = await this.props.authCheck();
      unwrapResult(actionResult);
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    let routes = (
      <Switch>
        <Route path="/auth" component={Auth} />
        <Route path="/" exact component={BurgerBuilder} />
        <Redirect to="/auth" />
      </Switch>
    );

    if (this.props.isAuthenticated) {
      routes = (
        <Switch>
          <Route path="/checkout" component={Checkout} />
          <Route path="/orders" component={Orders} />
          <Route path="/auth" component={Auth} />
          <Route path="/logout" component={Logout} />
          <Route path="/" exact component={BurgerBuilder} />
          <Route
            render={() => <ErrorHandler error="Cannot find this page" />}
          />
        </Switch>
      );
    }
    return (
      <div>
        <Layout>{routes}</Layout>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    authCheck: () => dispatch(authCheck()),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
