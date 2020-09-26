import React, { Component } from "react";
import CheckoutSummary from "../../components/Order/CheckoutSummary/CheckoutSummary";
import { Route } from "react-router-dom";
import ContactData from "./ContactData/ContactData";
import { connect } from "react-redux";
import ErrorHandler from '../../components/ErrorHandler/ErrorHandler';

class Checkout extends Component {
  handleContinueClick = () => {
    this.props.history.replace("/checkout/contact-data");
  };

  handleCancelClick = () => {
    this.props.history.goBack();
  };

  render() {

    return (
      <div>
        {this.props.ingredients && this.props.orderBurgerStatus !== 'failed' ? (
          <React.Fragment>
            <CheckoutSummary
              onContinueClick={this.handleContinueClick}
              onCancelClick={this.handleCancelClick}
              ingredients={this.props.ingredients}
            />
            <Route
              path={this.props.match.path + "/contact-data"}
              render={(props) => (
                <ContactData
                  {...props}
                  price={this.props.totalPrice}
                  ingredients={this.props.ingredients}
                />
              )}
            />
          </React.Fragment>
        ) : (
          <ErrorHandler error={this.props.orderBurgerError} />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ingredients: state.burgerBuilder.ingredients,
    totalPrice: state.burgerBuilder.totalPrice,
    orderBurgerStatus: state.contactData.orderBurgerStatus,
    orderBurgerError: state.contactData.orderBurgerError,
  };
};

export default connect(mapStateToProps)(Checkout);
