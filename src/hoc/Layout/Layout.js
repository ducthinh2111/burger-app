import React, { Component } from "react";
import Auxiliary from "../Auxiliary/Auxiliary";
import classes from "./Layout.module.css";
import Toolbar from "../../components/Navigation/Toolbar/Toolbar";
import SideDrawer from "../../components/Navigation/SideDrawer/SideDrawer";

class Layout extends Component {

  state = {
    showSideDrawer: false
  }

  handleSideDrawerClose = () => {
    this.setState({showSideDrawer: false})
  }

  handleSideDrawerOpen = () => {
    this.setState({showSideDrawer: true})
  }

  render() {
    return (
      <Auxiliary>
        <Toolbar onSideDrawerOpen={this.handleSideDrawerOpen} />
        <SideDrawer open={this.state.showSideDrawer} onSideDrawerClose={this.handleSideDrawerClose} />
        <main className={classes.Content}>{this.props.children}</main>
      </Auxiliary>
    );
  }
}

export default Layout;
