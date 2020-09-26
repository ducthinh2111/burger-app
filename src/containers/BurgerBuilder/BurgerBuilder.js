import React, { Component } from "react";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import Spinner from "../../components/UI/Spinner/Spinner";
import ErrorHandler from "../../components/ErrorHandler/ErrorHandler";
import {
  ingredientAdded,
  ingredientRemoved,
  fetchIngredients,
  purchaseStateUpdated,
} from "./burgerBuilderSlice";
import { orderBurgerRefreshed } from "../Checkout/ContactData/ContactDataSlice";
import { connect, batch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";

class BurgerBuilder extends Component {
  state = {
    purchasing: false,
  };

  handleModalClose = () => {
    this.setState({ purchasing: false });
  };

  handleOrderButtonClick = () => {
    this.setState({ purchasing: true });
  };

  handleModalClose = () => {
    this.setState({ purchasing: false });
  };

  handleContinuePurchasing = () => {
    this.props.history.push("/checkout");
  };

  componentDidMount() {
    if (this.props.fetchIngredientsStatus === "idle") {
      batch(async () => {
        try {
          const actionResult = await this.props.fetchIngredients();
          unwrapResult(actionResult);
          this.props.purchaseStateUpdated();
        } catch (err) {
          console.log("Failed to fetch ingredients: ", err);
        }
      });
    }
  }

  render() {
    const disabledInfo = {
      ...this.props.ingredients,
    };

    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0 ? true : false;
    }

    let orderSummary = null;

    let burger = null;

    let error = null;

    if (this.props.fetchIngredientsStatus === "loading") {
      burger = <Spinner />;
    } else if (this.props.fetchIngredientsStatus === "succeeded") {
      burger = (
        <React.Fragment>
          <Burger ingredients={this.props.ingredients} />
          <BuildControls
            price={this.props.totalPrice}
            disabled={disabledInfo}
            onRemoveIngredient={(type) => this.props.ingredientRemoved(type)}
            onAddIngredient={(type) => this.props.ingredientAdded(type)}
            purchasable={this.props.purchasable}
            onOrderButtonClick={this.handleOrderButtonClick}
          />
        </React.Fragment>
      );

      orderSummary = (
        <OrderSummary
          totalPrice={this.props.totalPrice}
          onContinuePurchasing={this.handleContinuePurchasing}
          onModalClosed={this.handleModalClose}
          ingredients={this.props.ingredients}
        />
      );
    } else if (this.props.fetchIngredientsStatus === "failed") {
      error = <ErrorHandler error={this.props.fetchIngredientsError} />;
    }

    return (
      <React.Fragment>
        <Modal
          onModalClosed={this.handleModalClose}
          show={this.state.purchasing}
        >
          {orderSummary}
        </Modal>
        {error ? error : burger}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ingredients: state.burgerBuilder.ingredients,
    totalPrice: state.burgerBuilder.totalPrice,
    fetchIngredientsStatus: state.burgerBuilder.fetchIngredientsStatus,
    fetchIngredientsError: state.burgerBuilder.fetchIngredientsError,
    purchasable: state.burgerBuilder.purchasable,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    ingredientAdded: (type) => dispatch(ingredientAdded({ type })),
    ingredientRemoved: (type) => dispatch(ingredientRemoved({ type })),
    fetchIngredients: () => dispatch(fetchIngredients()),
    purchaseStateUpdated: () => dispatch(purchaseStateUpdated()),
    orderBurgerRefreshed: () => dispatch(orderBurgerRefreshed()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BurgerBuilder);
