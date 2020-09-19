import React from "react";
import classes from "./ToggleSideDrawer.module.css";

const toggleSideDrawer = (props) => (
  <div className={classes.ToggleSideDrawer} onClick={props.clicked}>
    <div></div>
    <div></div>
    <div></div>
  </div>
);

export default toggleSideDrawer;
