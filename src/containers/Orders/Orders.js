import React, { Component } from "react";
import Order from "../../components/Order/Order";
import { fetchOrders, fetchOrdersRefreshed } from "./OrdersSlice";
import { connect } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import Spinner from "../../components/UI/Spinner/Spinner";
import ErrorHandler from "../../components/ErrorHandler/ErrorHandler";

class Orders extends Component {
  async componentDidMount() {
    if (this.props.fetchOrdersStatus === "idle") {
      try {
        const actionResult = await this.props.fetchOrders();
        unwrapResult(actionResult);
      } catch (err) {
        console.log("Failed to fetch orders: ", err);
      } finally {
        this.props.fetchOrdersRefreshed();
      }
    }
  }

  render() {
    let orders = null;
    if (this.props.fetchOrdersStatus === "loading") {
      orders = <Spinner />;
    } else if (this.props.fetchOrdersStatus === "failed") {
      orders = <ErrorHandler error={this.props.fetchOrdersError} />;
    } else {
      orders = Object.keys(this.props.orders).map((key) => (
        <Order
          key={key}
          ingredients={this.props.orders[key].ingredients}
          price={this.props.orders[key].price}
        />
      ));
    }
    return <div>{orders}</div>;
  }
}

const mapStateToProps = (state) => {
  return {
    orders: state.orders.entities,
    fetchOrdersStatus: state.orders.fetchOrdersStatus,
    fetchOrdersError: state.orders.fetchOrdersError,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchOrders: () => dispatch(fetchOrders()),
    fetchOrdersRefreshed: () => dispatch(fetchOrdersRefreshed()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Orders);
