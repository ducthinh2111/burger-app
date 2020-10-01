import React, { Component } from "react";
import Button from "../../../components/UI/Button/Button";
import classes from "./ContactData.module.css";
import Spinner from "../../../components/UI/Spinner/Spinner";
import Input from "../../../components/UI/Input/Input";
import produce from "immer";
import { orderBurger, orderBurgerRefreshed } from "./ContactDataSlice";
import { fetchIngredientsRefreshed } from "../../BurgerBuilder/burgerBuilderSlice";
import { batch, connect } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";

class ContactData extends Component {
  state = {
    orderForm: {
      name: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Your name",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      street: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Street",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      zipCode: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "ZIP",
        },
        value: "",
        validation: {
          required: true,
          minLength: 5,
          maxLength: 5,
        },
        valid: false,
        touched: false,
      },
      country: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Country",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      email: {
        elementType: "input",
        elementConfig: {
          type: "email",
          placeholder: "Email",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      deliveryMethod: {
        elementType: "select",
        elementConfig: {
          options: [
            { value: "fastest", displayValue: "Fastest" },
            { value: "cheapest", displayValue: "Cheapest" },
          ],
        },
        value: "fastest",
        valid: true,
      },
    },
    validation: {},
    formIsValid: false,
  };

  handleOrder = (e) => {
    e.preventDefault();

    const formData = {};

    for (let e in this.state.orderForm) {
      formData[e] = this.state.orderForm[e].value;
    }

    const order = {
      ingredients: this.props.ingredients,
      price: this.props.price,
      orderData: formData,
    };
    batch(async () => {
      try {
        const actionResult = await this.props.orderBurger(
          order,
          this.props.token
        );
        unwrapResult(actionResult); // !important (try-catch cannot work without this line)
        this.props.fetchIngredientsRefreshed();
        this.props.history.replace("/");
      } catch (err) {
        console.log(err);
        alert(this.props.orderBurgerError);
      } finally {
        this.props.orderBurgerRefreshed();
      }
    });
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

    return isValid;
  };

  handleInputChange = (inputIdentifier, event) => {
    const isInputValid = this.checkValidity(
      event.target.value,
      this.state.orderForm[inputIdentifier].validation
    );

    const updatedOrderForm = produce(this.state.orderForm, (draft) => {
      draft[inputIdentifier].value = event.target.value;
      draft[inputIdentifier].valid = isInputValid;
      draft[inputIdentifier].touched = true;
    });

    const formIsValid = Object.keys(updatedOrderForm).reduce((isValid, e) => {
      return updatedOrderForm[e].valid && isValid;
    }, true);

    this.setState({
      orderForm: updatedOrderForm,
      formIsValid: formIsValid,
    });
  };

  render() {
    const formElementArray = [];
    for (let key in this.state.orderForm) {
      formElementArray.push({
        id: key,
        config: this.state.orderForm[key],
      });
    }
    let form = (
      <form onSubmit={this.handleOrder}>
        {formElementArray.map((formElement) => {
          return (
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
          );
        })}
        <Button btnType="Success" disabled={!this.state.formIsValid}>
          ORDER
        </Button>
      </form>
    );
    if (this.props.orderBurgerStatus === "loading") {
      form = <Spinner />;
    }
    return (
      <div className={classes.ContactData}>
        <h4>Enter your Contact Data</h4>
        {form}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    orderBurgerStatus: state.contactData.orderBurgerStatus,
    orderBurgerError: state.contactData.orderBurgerError,
    token: state.auth.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    orderBurger: (order, token) => dispatch(orderBurger({ order, token })),
    fetchIngredientsRefreshed: () => dispatch(fetchIngredientsRefreshed()),
    orderBurgerRefreshed: () => dispatch(orderBurgerRefreshed()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ContactData);
