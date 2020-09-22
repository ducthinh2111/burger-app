import React from "react";
import classes from "./CheckoutSummary.module.css";
import Burger from "../../Burger/Burger";
import Button from "../../UI/Button/Button";

const CheckoutSummary = (props) => {

  return (
    <div className={classes.CheckoutSummary}>
      <h1>We hope it tastes well!</h1>
      <div className={classes.Burger}>
        <Burger ingredients={props.ingredients} />
      </div>
      <Button btnType="Danger" onClick={props.onCancelClick}>
        CANCEL
      </Button>
      <Button btnType="Success" onClick={props.onContinueClick}>
        CONTINUE
      </Button>
    </div>
  );
};

export default CheckoutSummary;
