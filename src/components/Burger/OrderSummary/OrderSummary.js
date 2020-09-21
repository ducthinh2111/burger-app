import React, {useEffect} from "react";
import Button from '../../UI/Button/Button';

const OrderSummary = (props) => {

  useEffect(() => {
    console.log('[OrderSummary.js] components did mount/updated');
    return () => {
      console.log('[OrderSummary.js] Clear up components')
    };
  });

  const ingredientSummary = Object.keys(props.ingredients).map((key) => {
    return (
      <li key={key}>
        <span style={{ textTransform: "capitalize" }}>{key}</span>:{" "}
        {props.ingredients[key]}
      </li>
    );
  });

  return (
    <React.Fragment>
      <h3>Your Order</h3>
      <p>A delicious burger with the following ingredients:</p>
      <ul>
        {ingredientSummary}
      </ul>
      <p><strong>Total Price: {props.totalPrice.toFixed(2)}</strong></p>
      <p>Continue to checkout?</p>
      <Button onClick={props.onModalClosed} btnType="Danger">CANCEL</Button>
      <Button onClick={props.onContinuePurchasing} btnType="Success">CONTINUE</Button>
    </React.Fragment>
  );
};

export default OrderSummary;
