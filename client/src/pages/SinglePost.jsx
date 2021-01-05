import { useMutation, useQuery } from "@apollo/react-hooks";
import { Badge, Button, Grid, Input } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import { red } from "@material-ui/core/colors";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import CommentIcon from "@material-ui/icons/Comment";
import gql from "graphql-tag";
import moment from "moment";
import React, { useContext, useState } from "react";
import DeleteButton from "../components/DeleteButton";
import LikeButton from "../components/LikeButton";
import { AuthContext } from "../context/auth";

const FETCH_SINGLE_POST = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
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
        createdAt
        body
      }
    }
  }
`;

const SUBMIT_COMMENT_MUTATION = gql`
  mutation($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`;

const StyledBadge = withStyles((theme) => ({
  badge: {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}))(Badge);

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "100%",
  },
  avatar: {
    backgroundColor: red[500],
    height: 150,
    width: 150,
    fontSize: "3rem",
  },
  paper: {
    height: 150,
    width: "100%",
  },
}));

export default function SinglePost(props) {
  const { user } = useContext(AuthContext);
  const classes = useStyles();
  const postId = props.match.params.postId;

  const [comment, setComment] = useState("");

  const deletePostCallback = () => {
    props.history.push("/");
  };

  const { data } = useQuery(FETCH_SINGLE_POST, {
    variables: {
      postId,
    },
  });

  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    update() {
      setComment("");
    },
    variables: {
      postId,
      body: comment,
    },
  });

  let postMarkUp;

  if (!data) {
    postMarkUp = <p>Loading post..</p>;
  } else {
    const {
      id,
      body,
      createdAt,
      username,
      comments,
      likes,
      likeCount,
      commentCount,
    } = data.getPost;

    console.log(comments);

    postMarkUp = (
      <Grid container style={{ marginTop: 20 }}>
        <Grid item xs={3} sm={3} md={3} lg={3} style={{ paddingLeft: "8%" }}>
          <Avatar aria-label="recipe" className={classes.avatar}>
            {username[0]}
          </Avatar>
        </Grid>
        <Grid item xs={12} sm={12} md={8} lg={8}>
          <Card className={classes.root}>
            <CardHeader
              title={username}
              subheader={moment(createdAt).fromNow()}
            />
            <CardContent>
              <Typography variant="body2" color="textSecondary" component="p">
                {body}
              </Typography>
            </CardContent>
            <CardActions disableSpacing>
              <LikeButton user={user} post={{ id, likes, likeCount }} />
              <IconButton
                aria-label="comment"
                onClick={() => console.log("comment button pressed")}
              >
                <StyledBadge badgeContent={commentCount} color="secondary">
                  <CommentIcon />
                </StyledBadge>
              </IconButton>
              {user && user.username === username && (
                <DeleteButton postId={id} callback={deletePostCallback} />
              )}
            </CardActions>
          </Card>
          {user && (
            <Card className={classes.root} style={{ marginTop: 10 }}>
              <CardContent>
                <p>Post a comment</p>
                <form className={classes.root} noValidate>
                  <Input
                    type="text"
                    placeholder="message..."
                    name="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="MuiInput-root"
                    style={{ width: "75%" }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={comment.trim() === ""}
                    onClick={submitComment}
                  >
                    Send🐞
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
          {comments &&
            comments.map((comment) => (
              <Card className={classes.root} style={{ marginTop: 10 }}>
                <CardContent>
                  <Typography variant="h6" component="h2">
                    {comment.username}
                  </Typography>
                  <Typography className={classes.pos} color="textSecondary">
                    {moment(comment.createdAt).fromNow()}
                  </Typography>
                  <Typography variant="body2" component="p">
                    {comment.body}
                  </Typography>
                </CardContent>
                {user && user.username === comment.username && (
                  <CardActions>
                    <DeleteButton postId={postId} commentId={comment.id} />
                  </CardActions>
                )}
              </Card>
            ))}
        </Grid>
      </Grid>
    );
  }
  return postMarkUp;
}
