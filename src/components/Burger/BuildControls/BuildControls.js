import React from "react";
import classes from "./BuildControls.module.css";
import BuildControl from "./BuildControl/BuildControl";

const controls = [
  { label: "Salad", type: "salad" },
  { label: "Bacon", type: "bacon" },
  { label: "Cheese", type: "cheese" },
  { label: "Meat", type: "meat" },
];

const buildControls = (props) => (
  <div className={classes.BuildControls}>
    <p>
      Current price: <strong>{props.price.toFixed(2)}</strong>
    </p>
    {controls.map((ctrl) => (
      <BuildControl
        disabled={props.disabled[ctrl.type]}
        onAddIngredient={() => props.onAddIngredient(ctrl.type)}
        onRemoveIngredient={() => props.onRemoveIngredient(ctrl.type)}
        key={ctrl.type}
        label={ctrl.label}
      />
    ))}
    <button
      onClick={props.onOrderButtonClick}
      disabled={!props.purchasable}
      className={classes.OrderButton}
    >
      {props.isAuth ? 'ORDER NOW' : 'SIGN UP TO ORDER'}
    </button>
  </div>
);

export default buildControls;
