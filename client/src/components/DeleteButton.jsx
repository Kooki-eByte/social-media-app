import { useMutation } from "@apollo/react-hooks";
import { Popover, Typography } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import gql from "graphql-tag";
import React, { useState } from "react";
import { FETCH_ALL_POSTS } from "../utils/graphql";

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
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

export default function DeleteButton({ postId, commentId, callback }) {
  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const [deletePostOrComment] = useMutation(mutation, {
    update(proxy) {
      if (!commentId) {
        const data = proxy.readQuery({
          query: FETCH_ALL_POSTS,
        });
        data.getPosts = data.getPosts.filter((post) => post.id !== postId);
        proxy.writeQuery({ query: FETCH_ALL_POSTS, data });
      }

      if (callback) callback();
    },
    variables: {
      postId,
      commentId,
    },
  });

  return (
    <IconButton
      aria-label="view-post"
      onClick={() => {
        let confirmDelete = window.confirm("Are you sure you want to delete?");

        confirmDelete
          ? deletePostOrComment()
          : console.log("post was not deleted");
      }}
      style={{ float: "right" }}
      onMouseEnter={handlePopoverOpen}
      onMouseLeave={handlePopoverClose}
      aria-owns={open ? "mouse-over-popover" : undefined}
      aria-haspopup="true"
    >
      <DeleteIcon />
      <Popover
        id="mouse-over-popover"
        style={{ pointerEvents: "none" }}
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
        <Typography>Delete</Typography>
      </Popover>
    </IconButton>
  );
}
