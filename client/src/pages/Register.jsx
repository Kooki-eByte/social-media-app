import { useMutation } from "@apollo/react-hooks";
import { Button, Grid, LinearProgress } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Snackbar from "@material-ui/core/Snackbar";
import MuiTextField from "@material-ui/core/TextField";
import { Field, Form, Formik } from "formik";
import { fieldToTextField, TextField } from "formik-material-ui";
import gql from "graphql-tag";
import React, { useContext, useState } from "react";
import { AuthContext } from "../context/auth";

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

function UpperCasingTextField(props) {
  const {
    form: { setFieldValue },
    field: { name },
  } = props;

  return <MuiTextField {...fieldToTextField(props)} />;
}

export default function Register(props) {
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

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, { data: { register: userData } }) {
      context.login(userData);
      props.history.push("/");
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
      handleError();
      console.log(Object.keys(errors).length);
    },
    variables: values,
  });

  const submitUser = () => {
    addUser();
  };

  return (
    <React.Fragment>
      <h1 style={{ textAlign: "center" }}>Register</h1>
      <Grid container justify="center">
        <Formik
          initialValues={{
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
          validate={(values) => {
            const errors = {};
            if (!values.email) {
              errors.email = "Required";
            } else if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
            ) {
              errors.email = "Invalid email address";
            }
            return errors;
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
                />
              </Box>
              <Box margin={1}>
                <Field
                  component={UpperCasingTextField}
                  name="email"
                  type="email"
                  label="Email"
                  helperText="Please Enter Email"
                />
              </Box>
              <Box margin={1}>
                <Field
                  component={TextField}
                  type="password"
                  label="Password"
                  name="password"
                />
              </Box>
              <Box margin={1}>
                <Field
                  component={TextField}
                  type="password"
                  label="Confirm Password"
                  name="confirmPassword"
                />
              </Box>
              {isSubmitting && <LinearProgress />}
              <Box margin={1}>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  onClick={submitForm}
                >
                  Register
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
