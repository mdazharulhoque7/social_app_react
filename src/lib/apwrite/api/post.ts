import { ID } from "appwrite";
import conf from "@/_conf/conf";
import { INewPost } from "@/types";
import { database } from "../config";
import { deleteFile, getFilePreview, uploadFile } from "./file";

export async function createPost(post: INewPost) {
  try {
    // 1: Upload File to storage
    const uploadedFile = await uploadFile(post.file[0]);
    if (!uploadedFile) throw Error;

    // 2: Get the uploaded file url
    const mediaURL = getFilePreview(uploadedFile.$id);
    if (!mediaURL) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    // 3: Convert the tags into array -separated by comma
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // 4: Create Post
    const newPost = await database.createDocument(
      conf.appwriteDatabaseId,
      conf.appwritePostCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageURL: mediaURL,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags,
      }
    );

    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }
    return newPost;
  } catch (error) {
    console.log(error);
  }
}
