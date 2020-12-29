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

const FETCH_POSTS_QUERY = gql`
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
  const {
    loading,
    data: { getPosts },
  } = useQuery(FETCH_POSTS_QUERY);
  const classes = useStyles();

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
              getPosts.map((post) => <PostCard id={post.id} post={post} />)
            )}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
