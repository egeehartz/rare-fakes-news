//displays details of a post, lets use add reactions (maximum one of each) to post, lets user edit post if they are the author, or see author's profile if it was written by another user
import React, { useContext, useEffect, useState, useRef } from "react";
import { PostContext } from "./PostProvider";
import { ReactionList } from "../Reactions/ReactionList";
import { Link } from "react-router-dom";
import { DeleteTagItem } from "../utils/DeleteTagItem";
import { TagPostContext } from "../Tags/TagPostProvider";

export const PostDetails = (props) => {
  const { getPostById, post, setPost, getTagsByPost, postTags } = useContext(
    PostContext
  );

  const { TagPosts } = useContext(TagPostContext);

  //state variable and variables needed to make tag management work
  const [selectedTagPostId, setSelectedTagPostId] = useState(0);
  const tagPostId = useRef(null);
  const postId = parseInt(props.match.params.postId);

  //gets a post by the post ID and gets the tags associated with that post
  useEffect(() => {
    getPostById(postId).then(setPost);
    getTagsByPost(postId);
  }, [TagPosts]);

  //takes what is selected in the tag management dropdown and sets the state variable with that value
  const handleChange = (e) => {
    setSelectedTagPostId(parseInt(e.target.value));
  };

  //state variable and functions to show/hide the tag management feature
  const [open, setOpen] = useState();
  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(undefined);

  return (
    <>
      {/* Post Detail JSX */}
      <section className="post">
        <h3 className="post__title">{post.title}</h3>
        <div className="post__content">{post.content}</div>
        <div className="post_date">
          Published on: {new Date(post.date).toLocaleDateString("en-US")}
        </div>

        <div>
          {post.user_id === parseInt(localStorage.getItem("rare_user_id")) ? (
            <>
              <div className="post_author">
                Author: {post.user.display_name} (you!)
              </div>
              <button
                onClick={() => props.history.push(`/posts/edit/${post.id}`)}
              >
                edit
              </button>
              <button onClick={onOpen}>Manage Post Tags</button>
            </>
          ) : (
            <Link to={{ pathname: `/profiles/${post.user_id}` }}>
              <div className="post_author">
                Author: {post.user.display_name}
              </div>
            </Link>
          )}
        </div>
        <div>
          {postTags.map((postTag) => {
            return <div>{postTag.tag}</div>;
          })}
        </div>
        {/* Tag Management JSX */}
       
        {open && (
          <>
            <select
              name="tagManagement"
              className="form-control"
              ref={tagPostId}
              onChange={handleChange}
            >
              <option value="0">Select a Tag</option>
              {postTags.map((tag) => (
                <option key={tag.id} value={tag.tagPost.id}>
                  {tag.tag}
                </option>
              ))}
            </select>
            <button onClick={onClose}>Cancel</button>
            <DeleteTagItem tagPostId={selectedTagPostId} postId={postId} />
          </>
        )}
      </section>
      <ReactionList {...props} />{/*Renders ReactionList*/}
    </>
  );
};
