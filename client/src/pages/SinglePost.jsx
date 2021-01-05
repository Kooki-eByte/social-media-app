import { useQuery } from "@apollo/react-hooks";
import { Badge, Grid } from "@material-ui/core";
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
import VisibilityIcon from "@material-ui/icons/Visibility";
import gql from "graphql-tag";
import moment from "moment";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
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

  const deletePostCallback = () => {
    props.history.push("/");
  };

  const { data } = useQuery(FETCH_SINGLE_POST, {
    variables: {
      postId,
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

    postMarkUp = (
      <Grid container style={{ marginTop: 20 }}>
        <Grid
          item
          xs={3}
          sm={3}
          md={3}
          lg={3}
          style={{ alignSelf: "center", paddingLeft: "8%" }}
        >
          <Avatar aria-label="recipe" className={classes.avatar}>
            {username[0]}
          </Avatar>
        </Grid>
        <Grid item xs={12} sm={12} md={9} lg={9}>
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
              <IconButton aria-label="view-post">
                <Link to={`/posts/${id}`} style={{ color: "#787878" }}>
                  <VisibilityIcon />
                </Link>
              </IconButton>
              {user && user.username === username && (
                <DeleteButton postId={id} callback={deletePostCallback} />
              )}
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    );
  }
  return postMarkUp;
}
