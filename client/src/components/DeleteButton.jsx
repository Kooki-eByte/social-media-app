import { useMutation } from "@apollo/react-hooks";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import gql from "graphql-tag";
import React from "react";
import { FETCH_ALL_POSTS } from "../utils/graphql";

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

export default function DeleteButton({ postId, callback }) {
  const [deletePost] = useMutation(DELETE_POST_MUTATION, {
    update(proxy) {
      const data = proxy.readQuery({
        query: FETCH_ALL_POSTS,
      });
      data.getPosts = data.getPosts.filter((post) => post.id !== postId);
      proxy.writeQuery({ query: FETCH_ALL_POSTS, data });

      if (callback) callback();
    },
    variables: {
      postId,
    },
  });

  return (
    <IconButton
      aria-label="view-post"
      onClick={() => {
        let confirmDelete = window.confirm("Are you sure you want to delete?");

        confirmDelete ? deletePost() : console.log("post was not deleted");
      }}
      style={{ float: "right" }}
    >
      <DeleteIcon />
    </IconButton>
  );
}
