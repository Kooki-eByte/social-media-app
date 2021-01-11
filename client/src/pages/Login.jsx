import { useMutation } from "@apollo/react-hooks";
import { Button, Grid, LinearProgress } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Snackbar from "@material-ui/core/Snackbar";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import gql from "graphql-tag";
import React, { useContext, useState } from "react";
import { AuthContext } from "../context/auth";

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

export default function Login(props) {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [openSnack, setOpenSnack] = useState(false);

  const handleError = () => {
    setOpenSnack(true);
  };

  const handleClose = () => {
    setOpenSnack(false);
  };

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, { data: { login: userData } }) {
      context.login(userData);
      props.history.push("/");
    },
    onError(err) {
      console.log(err.graphQLErrors[0].extensions.exception.errors);
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
      handleError();
      console.log(Object.keys(errors).length);
    },
    variables: values,
  });

  const submitUser = () => {
    loginUser();
  };

  return (
    <React.Fragment>
      <h1 style={{ textAlign: "center" }}>Login</h1>
      <Grid container justify="center">
        <Formik
          initialValues={{
            username: "",
            password: "",
          }}
          onSubmit={(value, { setSubmitting }) => {
            setTimeout(() => {
              setSubmitting(false);
              // values sends a object of the username, email, and password
              setValues(value);
              submitUser();
              // alert(JSON.stringify(values, null, 2));
            }, 500);
          }}
        >
          {({ submitForm, isSubmitting }) => (
            <Form className={loading ? "loading" : ""}>
              <Box margin={1}>
                <Field
                  component={TextField}
                  type="username"
                  label="username"
                  name="username"
                  className="username"
                />
              </Box>
              <Box margin={1}>
                <Field
                  component={TextField}
                  type="password"
                  label="Password"
                  name="password"
                  className="password"
                />
              </Box>
              {isSubmitting && <LinearProgress />}
              <Box margin={1}>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  onClick={submitForm}
                  name="loginButton"
                >
                  Login
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
        {Object.keys(errors).length > 0 &&
          Object.values(errors).map((error) => {
            return (
              <Snackbar
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                open={openSnack}
                autoHideDuration={6000}
                onClose={handleClose}
                message={error}
                severity="info"
                key={error}
              />
            );
          })}
      </Grid>
    </React.Fragment>
  );
}
