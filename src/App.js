import React, { Component, Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { authCheck } from "./containers/Auth/AuthSlice";
import { unwrapResult } from "@reduxjs/toolkit";

import Layout from "./hoc/Layout/Layout";
import BurgerBuilder from "./containers/BurgerBuilder/BurgerBuilder";
import ErrorHandler from "./components/ErrorHandler/ErrorHandler";
import Logout from "./containers/Auth/Logout/Logout";
import Spinner from "./components/UI/Spinner/Spinner";

const Checkout = React.lazy(() => import("./containers/Checkout/Checkout"));
const Orders = React.lazy(() => import("./containers/Orders/Orders"));
const Auth = React.lazy(() => import("./containers/Auth/Auth"));

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
        <Route
          path="/auth"
          render={(props) => (
            <Suspense fallback={<Spinner />}>
              <Auth {...props} />
            </Suspense>
          )}
        />
        <Route path="/" exact component={BurgerBuilder} />
        <Redirect to="/auth" />
      </Switch>
    );

    if (this.props.isAuthenticated) {
      routes = (
        <Switch>
          <Route
            path="/checkout"
            render={(props) => (
              <Suspense fallback={<Spinner />}>
                <Checkout {...props} />
              </Suspense>
            )}
          />
          <Route
            path="/orders"
            render={(props) => (
              <Suspense fallback={<Spinner />}>
                <Orders {...props} />
              </Suspense>
            )}
          />
          <Route
            path="/auth"
            render={(props) => (
              <Suspense fallback={<Spinner />}>
                <Auth {...props} />
              </Suspense>
            )}
          />
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

export default connect(mapStateToProps, mapDispatchToProps)(App);
