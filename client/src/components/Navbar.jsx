import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function ButtonAppBar() {
  const { user, logout } = useContext(AuthContext);

  const classes = useStyles();

  const navBar = user ? (
    <div className={classes.root}>
      <AppBar position="static" color="transparent">
        <Toolbar>
          <Link to={"/"} style={{ textDecoration: "none" }}>
            <Button color="#000000de" size="large">
              {user.username}
            </Button>
          </Link>
          <Typography
            variant="h6"
            className={classes.title}
            style={{ textAlign: "center" }}
          >
            Social Bug
          </Typography>
          <Button color="#000000de" size="large" onClick={logout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  ) : (
    <div className={classes.root}>
      <AppBar position="static" color="transparent">
        <Toolbar>
          <Link to={"/"}>
            <Button color="#000000de" size="large">
              Home
            </Button>
          </Link>
          <Typography
            variant="h6"
            className={classes.title}
            style={{ textAlign: "center" }}
          >
            Social Bug
          </Typography>
          <Link to={"/login"}>
            <Button color="#000000de" size="large">
              Login
            </Button>
          </Link>
          <Link to={"/register"}>
            <Button color="#000000de" size="large">
              Register
            </Button>
          </Link>
        </Toolbar>
      </AppBar>
    </div>
  );

  return navBar;
}
