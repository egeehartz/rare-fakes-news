//single reaction component that also watches ReactionPost state to update the count for each reaction, limit user from having the same reaction more than once
import React, { useContext, useEffect, useState } from "react";
import { ReactionPostContext } from "../Reactions/ReactionPostProvider";
import { PostContext } from "../Posts/PostProvider";
import { Box, Button } from "grommet";
import { ReactionModal } from "./ReactionModal";

export const Reaction = (props) => {
  const { createReactionPost, getReactionPosts, ReactionPosts } = useContext(
    ReactionPostContext
  );

  const [reactionCount, setReactionCount] = useState([]); //array of RP objects
  const [filteredRP, setFilteredRP] = useState([]); //filtered array of RP objects for this post
  const postId = parseInt(props.match.params.postId);

  //state variable and functions that change state of the state variable
  const [open, setOpen] = useState();
  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(undefined);

  useEffect(() => {
    getReactionPosts();
  }, []);

  useEffect(() => {
    const reactionsForThisPost = ReactionPosts.filter((rp) => {
      //find rp objects only for this post
      return rp.post.id === postId;
    });
    setFilteredRP(reactionsForThisPost); //set state variable of RP object array
  }, [ReactionPosts]);

  useEffect(() => {
    const matchingReactionCount =
      filteredRP.filter((rp) => {
        //filter through RP obj arr for this post to find the RP objs whose reaction_id matches the id of the reaction of this current module
        return rp.reaction.id === props.reaction.id;
      }) || [];
    setReactionCount(matchingReactionCount);
  }, [filteredRP]);

  const constructOneTimeReactionPostObj = () => {
    //create an RP object
    const checkForExistingReaction = filteredRP.find((rp) => {
      //see if it already exists
      if (rp.user_id === parseInt(localStorage.getItem("rare_user_id"))) {
        //see if current user already had this reaction
        return rp.reaction.id === props.reaction.id;
      }
    });

    if (checkForExistingReaction === undefined) {
      //if no RP obj found, let user add a reaction
      createReactionPost({
        reaction_id: props.reaction.id,
        post_id: postId,
      });
    } else {
      //setOpen(true)
      window.alert("You've already selected this reaction!");
    }
  };

  return (
    <Box gap="xmsall" direction="row-responsive" className="reaction">
      <ReactionModal open={open} onClose={onClose} />
      <Button
        title={props.reaction.label}
        onClick={() => {
          constructOneTimeReactionPostObj();
        }}
      >
        {props.reaction.image_url}
      </Button>
      <Box margin="xsmall" className="reactionCount">
        {reactionCount.length}
      </Box>
    </Box>
  );
};
