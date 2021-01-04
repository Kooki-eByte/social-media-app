import { useMutation } from "@apollo/react-hooks";
import { Badge } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core/styles";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderOutlinedIcon from "@material-ui/icons/FavoriteBorderOutlined";
import gql from "graphql-tag";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes {
        id
        username
      }
      likeCount
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

export default function LikeButton({ user, post: { id, likes, likeCount } }) {
  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId: id },
  });
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (user && likes.find((like) => like.username === user.username)) {
      setLiked(true);
    } else setLiked(false);
  }, [user, likes]);

  // Changes the look of the button
  const likeButton = user ? (
    liked ? (
      <StyledBadge badgeContent={likeCount} color="secondary">
        <FavoriteIcon />
      </StyledBadge>
    ) : (
      <StyledBadge badgeContent={likeCount} color="secondary">
        <FavoriteBorderOutlinedIcon />
      </StyledBadge>
    )
  ) : (
    <Link to={"/register"} style={{ color: "#787878" }}>
      <StyledBadge badgeContent={likeCount} color="secondary">
        <FavoriteBorderOutlinedIcon />
      </StyledBadge>
    </Link>
  );

  return (
    <IconButton aria-label="like" onClick={() => likePost()}>
      {likeButton}
    </IconButton>
  );
}
