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
import DeleteIcon from "@material-ui/icons/Delete";
import VisibilityIcon from "@material-ui/icons/Visibility";
import moment from "moment";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth";
import LikeButton from "./LikeButton";

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
    maxWidth: 350,
  },
  avatar: {
    backgroundColor: red[500],
  },
  paper: {
    height: 150,
    width: 300,
  },
}));

export default function PostCard({
  id,
  post: { body, createdAt, username, likeCount, commentCount, likes },
}) {
  const { user } = useContext(AuthContext);

  const classes = useStyles();

  function commentPost() {
    console.log("selected to comment on post!");
  }

  return (
    <Grid key={id} item xs={12} sm={6} md={4} lg={3}>
      <Card className={classes.root}>
        <CardHeader
          avatar={
            <Avatar aria-label="recipe" className={classes.avatar}>
              {username[0]}
            </Avatar>
          }
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
          <IconButton aria-label="comment" onClick={() => commentPost()}>
            <Link to={`/post/${id}`} style={{ color: "#787878" }}>
              <StyledBadge badgeContent={commentCount} color="secondary">
                <CommentIcon />
              </StyledBadge>
            </Link>
          </IconButton>
          <IconButton aria-label="view-post">
            <Link to={`/posts/${id}`} style={{ color: "#787878" }}>
              <VisibilityIcon />
            </Link>
          </IconButton>
          {user && user.username === username && (
            <IconButton
              aria-label="view-post"
              onClick={() => console.log("Delete Post")}
              style={{ float: "right" }}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </CardActions>
      </Card>
    </Grid>
  );
}
