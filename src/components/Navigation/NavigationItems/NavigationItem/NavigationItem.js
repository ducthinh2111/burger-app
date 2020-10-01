import React from "react";
import classes from "./NavigationItem.module.css";
import NavLink from '../../NavLink/NavLink';

const navigationItem = (props) => (
  <li className={classes.NavigationItem}>
    <NavLink exact activeClassName={classes.active} to={props.link}>
      {props.children}
    </NavLink>
  </li>
);

export default navigationItem;
