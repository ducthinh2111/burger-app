import React from "react";
import classes from "./Input.module.css";

const input = (props) => {
  let inputElement = null;
  const inputClasses = [classes.InputElement];

  let validationError = null;

  if (props.invalid && props.shouldValidate && props.touched) {
    inputClasses.push(classes.Invalid);
    validationError = <p className={classes.ValidationError}>Please enter a valid value!</p>;
  }

  switch (props.elementType) {
    case "input":
      inputElement = (
        <input
          onChange={props.onChange}
          value={props.value}
          className={inputClasses.join(" ")}
          {...props.elementConfig}
        />
      );
      break;
    case "textarea":
      inputElement = (
        <textarea
          onChange={props.onChange}
          value={props.value}
          className={inputClasses.join(" ")}
          {...props.elementConfig}
        />
      );
      break;
    case "select":
      inputElement = (
        <select
          onChange={props.onChange}
          value={props.value}
          className={inputClasses.join(" ")}
        >
          {props.elementConfig.options.map((op) => {
            return (
              <option key={op.value} value={op.value}>
                {op.displayValue}
              </option>
            );
          })}
        </select>
      );
      break;
    default:
      inputElement = (
        <input
          onChange={props.onChange}
          value={props.value}
          className={inputClasses.join(" ")}
          {...props.elementConfig}
        />
      );
      break;
  }

  return (
    <div className={classes.Input}>
      <label className={classes.Label}>{props.label}</label>
      {inputElement}
      {validationError}
    </div>
  );
};

export default input;
