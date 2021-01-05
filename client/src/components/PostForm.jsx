import { useMutation } from "@apollo/react-hooks";
import { Button, Grid, LinearProgress } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Snackbar from "@material-ui/core/Snackbar";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import gql from "graphql-tag";
import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { FETCH_ALL_POSTS } from "../utils/graphql.js";

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      likes {
        id
        username
        createdAt
      }
      likeCount
      comments {
        id
        body
        username
        createdAt
      }
      commentCount
    }
  }
`;

export default function PostForm(props) {
  const [openSnack, setOpenSnack] = useState(false);

  const handleError = () => {
    setOpenSnack(true);
  };

  const handleClose = () => {
    setOpenSnack(false);
  };

  const [values, setValues] = useState({
    body: "",
  });

  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_ALL_POSTS,
      });
      data.getPosts = [result.data.createPost, ...data.getPosts];
      proxy.writeQuery({ query: FETCH_ALL_POSTS, data });
      setValues("");
      Redirect("/");
    },
    onError(_) {
      handleError();
    },
  });

  const submitPost = () => {
    console.log(values);
    createPost();
  };
  return (
    <Grid item xs={12} sm={12} md={3} lg={3}>
      <h2>Create a post: </h2>
      <Formik
        initialValues={{
          body: "",
        }}
        onSubmit={(value, { setSubmitting }) => {
          setTimeout(() => {
            setSubmitting(false);
            // values sends a object of the username, email, and password
            setValues(value);
            submitPost();
            // alert(JSON.stringify(values, null, 2));
          }, 500);
        }}
      >
        {({ submitForm, isSubmitting }) => (
          <Form>
            <Box margin={1}>
              <Field
                component={TextField}
                type="text"
                label="Hello, World!"
                name="body"
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
                Post
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
      {error && (
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          open={openSnack}
          autoHideDuration={5000}
          onClose={handleClose}
          message={error.graphQLErrors[0].message}
          severity="info"
          key={error}
        />
      )}
    </Grid>
  );
}
