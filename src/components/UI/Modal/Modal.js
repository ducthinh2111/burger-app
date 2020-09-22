import React, { useEffect } from "react";
import classes from "./Modal.module.css";
import Auxiliary from "../../../hoc/Auxiliary/Auxiliary";
import Backdrop from "../Backdrop/Backdrop";

const Modal = (props) => {
  useEffect(() => {
    console.log("[Modal.js] components did mount/updated");
    return () => {
      console.log("[Modal.js] Clear up components");
    };
  }, [props.show, props.children]);

  return (
    <Auxiliary>
      <Backdrop clicked={props.onModalClosed} show={props.show} />
      <div
        className={classes.Modal}
        style={{
          transform: props.show ? "translateY(0)" : "translateY(-100vh)",
          opacity: props.show ? "1" : "0",
        }}
      >
        {props.children}
      </div>
    </Auxiliary>
  );
};

export default Modal;
