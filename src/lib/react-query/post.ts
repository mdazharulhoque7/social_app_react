import { useMutation } from "@tanstack/react-query";
import { createPost } from "../apwrite/api/post";
import { INewPost } from "@/types";

export const useCreatePost = () => {
  return useMutation({
    mutationFn: (post: INewPost) => createPost(post),
  });
};
