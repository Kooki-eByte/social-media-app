import { useQuery } from "@apollo/react-hooks";
import { CircularProgress, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import gql from "graphql-tag";
import React from "react";
import PostCard from "../components/PostCard";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));

const FETCH_ALL_POSTS = gql`
  {
    getPosts {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        body
        createdAt
      }
    }
  }
`;

export default function Home() {
  // Constant to get all of the posts from the database and a loading variable that holds a boolean that stays true until the data is grabbed.
  // RETURNS: Array of all posts
  const { loading, data } = useQuery(FETCH_ALL_POSTS);

  //   Grabs the styles from useStyles object
  const classes = useStyles();

  if (data !== undefined) {
    const { getPosts } = data;

    console.log(data);

    return (
      <div>
        <Grid container className={classes.root} spacing={2}>
          <Grid item xs={12} style={{ textAlign: "center" }}>
            <h1>Recent Posts</h1>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={3}>
              {loading ? (
                <CircularProgress />
              ) : (
                getPosts &&
                getPosts.map((post) => (
                  <PostCard key={post.id} id={post.id} post={post} />
                ))
              )}
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  } else {
    return (
      <div>
        <Grid container className={classes.root} spacing={2}>
          <Grid item xs={12} style={{ textAlign: "center" }}>
            <h1>Recent Posts</h1>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={3}>
              {loading ? <CircularProgress /> : <h1>No Data Found</h1>}
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}
