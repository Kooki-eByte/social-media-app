import { Badge, Grid, Popover, Typography } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import { red } from "@material-ui/core/colors";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import CommentIcon from "@material-ui/icons/Comment";
import moment from "moment";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth";
import DeleteButton from "./DeleteButton";
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
  popover: {
    pointerEvents: "none",
  },
}));

export default function PostCard({
  id,
  post: { body, createdAt, username, likeCount, commentCount, likes },
}) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const { user } = useContext(AuthContext);

  const classes = useStyles();

  return (
    <Grid key={id} item xs={12} sm={6} md={4} lg={3}>
      <Card className={classes.root}>
        <Link
          to={`/posts/${id}`}
          style={{ textDecoration: "none", color: "black" }}
        >
          <CardHeader
            avatar={
              <Avatar aria-label="recipe" className={classes.avatar}>
                {username[0]}
              </Avatar>
            }
            title={username}
            subheader={moment(createdAt).fromNow()}
          />
        </Link>
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            {body}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <LikeButton user={user} post={{ id, likes, likeCount }} />
          <IconButton
            aria-label="comment"
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
            aria-owns={open ? "mouse-over-popover" : undefined}
            aria-haspopup="true"
          >
            <Link to={`/post/${id}`} style={{ color: "#787878" }}>
              <StyledBadge badgeContent={commentCount} color="secondary">
                <CommentIcon />
              </StyledBadge>
            </Link>
            <Popover
              id="mouse-over-popover"
              className={classes.popover}
              open={open}
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              onClose={handlePopoverClose}
              disableRestoreFocus
            >
              <Typography>Comment on post</Typography>
            </Popover>
          </IconButton>
          {user && user.username === username && <DeleteButton postId={id} />}
        </CardActions>
      </Card>
    </Grid>
  );
}
