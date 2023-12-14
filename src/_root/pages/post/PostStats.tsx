import React, { useEffect, useState } from "react";
import { Models } from "appwrite";
import {
  useDeleteSavePost,
  useLikePost,
  useSavePost,
} from "@/lib/react-query/post";
import { checkIsLiked } from "@/lib/utils";
import { useGetCurrentUser } from "@/lib/react-query/auth";
import Loader from "@/components/shared/Loader";

type PostStatsProps = {
  post: Models.Document;
  userId: string;
};

const PostStats = ({ post, userId }: PostStatsProps) => {
  const likesList = post.likes.map((user: Models.Document) => user.$id);
  const [likes, setLikes] = useState(likesList);
  const [isSaved, setIsSaved] = useState(false);

  const { mutate: likePost, isPending: isTogglingLike } = useLikePost();
  const { mutate: savePost, isPending: isSavingPost } = useSavePost();
  const { mutate: deleteSavePost, isPending: isDeletingSavedPost } =
    useDeleteSavePost();

  const { data: currentUser } = useGetCurrentUser();

  // check if the current/loggedin user already saved the post
  const savedPostRecord = currentUser?.save.find(
    (record: Models.Document) => record.post.$id == post.$id
  );

  useEffect(() => {
    setIsSaved(savedPostRecord ? true : false);
  }, [currentUser]);

  const handleLikePost = (e: React.MouseEvent) => {
    e.preventDefault();

    // copy the likesArray so that we can modify it (though likes is const, it cann't be modified).
    let newLikes = [...likes];

    // check whether current/loggedIn use has liked it
    const hasLiked = newLikes.includes(userId);

    // Toggle user likes by filtering likes based on userId
    if (hasLiked) {
      // filter all the userid in likeList except the current/loggedIn userID
      newLikes = newLikes.filter((id) => id !== userId);
    } else {
      // include/push current/loggedIn userId onto likeList
      newLikes.push(userId);
    }

    setLikes(newLikes);
    likePost({ postId: post.$id, likesArray: newLikes });
  };
  const handleSavePost = (e: React.MouseEvent) => {
    e.preventDefault();

    if (savedPostRecord) {
      deleteSavePost(savedPostRecord.$id);
      setIsSaved(false);
    } else {
      savePost({ postId: post.$id, userId: userId });
      setIsSaved(true);
    }
  };

  return (
    <div className="z-20 flex items-center justify-between">
      <div className="flex gap-2 mr-5">
        {isTogglingLike ? (
          <Loader />
        ) : (
          <>
            <img
              src={
                checkIsLiked(likes, userId)
                  ? "/assets/icons/liked.svg"
                  : "/assets/icons/like.svg"
              }
              alt="like"
              width={20}
              height={20}
              onClick={handleLikePost}
              className="cursor-pointer"
            />
            <p className="small-medium lg:base-medium">{likes.length}</p>
          </>
        )}
      </div>
      <div>
        {isSavingPost || isDeletingSavedPost ? (
          <Loader />
        ) : (
          <img
            src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
            alt="saved"
            width={20}
            height={20}
            onClick={handleSavePost}
            className="cursor-pointer"
          />
        )}
      </div>
    </div>
  );
};

export default PostStats;
