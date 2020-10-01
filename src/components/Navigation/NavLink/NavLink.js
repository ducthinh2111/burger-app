import React from "react";
import { Route, NavLink as RouterLink, withRouter } from "react-router-dom";

const Link = ({
  to,
  location,
  children,
  staticContext,
  match,
  history,
  ...rest
}) => {
  /* eslint-disable react/jsx-no-bind */
  return (
    <Route
      render={() => (
        <RouterLink replace={to === location.pathname} to={to} {...rest}>
          {children}
        </RouterLink>
      )}
    />
  );
};

export default withRouter(Link);
