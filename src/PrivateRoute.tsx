import React from 'react';
import {
    Redirect,
    Route,
    RouteProps
} from "react-router-dom";
import { isSignedIn } from "./firebase";

const PrivateRoute: React.FC<RouteProps> = ({ children, ...rest }) => {
    return (
      <Route
        {...rest}
        render={({ location }) =>
          isSignedIn() ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: location }
              }}
            />
          )
        }
      />
    );
  }

  export default PrivateRoute;
