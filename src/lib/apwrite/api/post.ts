import { ID, Query } from "appwrite";
import conf from "@/_conf/conf";
import { INewPost, IUpdatePost } from "@/types";
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

// Getting Recent Posts
export async function getRecentPosts() {
  const posts = await database.listDocuments(
    conf.appwriteDatabaseId,
    conf.appwritePostCollectionId,
    [Query.orderDesc("$createdAt"), Query.limit(20)]
  );

  if (!posts) throw Error;
  return posts;
}

export async function getPostById(postId: string) {
  try {
    const post = database.getDocument(
      conf.appwriteDatabaseId,
      conf.appwritePostCollectionId,
      postId
    );
    return post;
  } catch (error) {
    console.log(error);
  }
}

export async function updatePost(post: IUpdatePost) {
  const hasFileToUpdate = post.file.length > 0;
  try {
    let image = {
      imageUrl: post.imageURL,
      imageId: post.imageId,
    };

    // 1: Upload File to storage if the file has been changed
    if (hasFileToUpdate) {
      const uploadedFile = await uploadFile(post.file[0]);
      if (!uploadedFile) throw Error;

      // 2: Get the updated file url
      const mediaURL = getFilePreview(uploadedFile.$id);
      if (!mediaURL) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }
      image = { ...image, imageUrl: mediaURL, imageId: uploadedFile.$id };
    }

    // 3: Convert the tags into array -separated by comma
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // 4: Update Post
    const updatedPost = await database.updateDocument(
      conf.appwriteDatabaseId,
      conf.appwritePostCollectionId,
      post.postId,
      {
        caption: post.caption,
        imageURL: image.imageUrl,
        imageId: image.imageId,
        location: post.location,
        tags: tags,
      }
    );

    if (!updatedPost) {
      await deleteFile(post.imageId);
      throw Error;
    }
    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

export async function deletePost(postId: string, imageId: string) {
  if (!postId || imageId) throw Error;
  try {
    await database.deleteDocument(
      conf.appwriteDatabaseId,
      conf.appwritePostCollectionId,
      postId
    );
    await deleteFile(imageId);
    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}

export async function likePost(postId: string, likesArray: string[]) {
  try {
    const updatedPost = await database.updateDocument(
      conf.appwriteDatabaseId,
      conf.appwritePostCollectionId,
      postId,
      {
        likes: likesArray,
      }
    );
    if (!updatedPost) throw Error;
    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

export async function savePost(postId: string, userId: string) {
  try {
    const updatedPost = await database.createDocument(
      conf.appwriteDatabaseId,
      conf.appwriteSaveCollectionId,
      ID.unique(),
      {
        users: userId,
        post: postId,
      }
    );
    if (!updatedPost) throw Error;
    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteSavedPost(savedPostId: string) {
  try {
    const status = await database.deleteDocument(
      conf.appwriteDatabaseId,
      conf.appwriteSaveCollectionId,
      savedPostId
    );
    if (!status) throw Error;
    return { status: "Ok" };
  } catch (error) {
    console.log(error);
  }
}
