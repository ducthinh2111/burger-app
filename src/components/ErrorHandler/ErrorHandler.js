import React from "react";
import errorImg from "../../assets/images/error.png";
import classes from './ErrorHandler.module.css';

export default (props) => {
  return (
    <div className={classes.ErrorHandler}>
      <img src={errorImg} alt="Error"></img>
      <h1>Something went wrong!</h1>
      <h2>{props.error}</h2>
    </div>
  );
};
