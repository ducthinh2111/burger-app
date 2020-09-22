import React, { Component } from "react";
import CheckoutSummary from "../../components/Order/CheckoutSummary/CheckoutSummary";
import { Route } from "react-router-dom";
import ContactData from "./ContactData/ContactData";

class Checkout extends Component {
  state = {
    ingredients: null,
    totalPrice: 0,
  };

  handleContinueClick = () => {
    this.props.history.replace("/checkout/contact-data");
  };

  handleCancelClick = () => {
    this.props.history.goBack();
  };

  componentWillMount() {
    const query = new URLSearchParams(this.props.location.search);
    const ingredients = {};
    let price = 0;
    for (let param of query.entries()) {
      if (param[0] === "price") {
        price = parseFloat(param[1]);
      } else {
        ingredients[param[0]] = parseInt(param[1]);
      }
    }
    this.setState({ ingredients: ingredients, totalPrice: price });
  }

  render() {
    return (
      <div>
        <CheckoutSummary
          onContinueClick={this.handleContinueClick}
          onCancelClick={this.handleCancelClick}
          ingredients={this.state.ingredients}
        />
        <Route
          path={this.props.match.path + "/contact-data"}
          render={(props) => (
            <ContactData
              {...props}
              price={this.state.totalPrice}
              ingredients={this.state.ingredients}
            />
          )}
        />
      </div>
    );
  }
}

export default Checkout;
