import { ID } from "appwrite";
import conf from "@/_conf/conf";
import { storage } from "@/lib/apwrite/config";

// ****************** UPLOAD FILE ********************
export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      conf.appwriteBucketId,
      ID.unique(),
      file
    );
    return uploadedFile;
  } catch (error) {
    console.log(error);
  }
}

// **************** GET FILE PRIVIEW URL *****************
export function getFilePreview(fileID: string) {
  try {
    const fileURL = storage.getFilePreview(
      conf.appwriteBucketId,
      fileID,
      2000,
      2000,
      "top",
      100
    );
    if (!fileURL) throw Error;
    return fileURL;
  } catch (error) {
    console.log(error);
  }
}

// ****************** DELETE FILE ************************
export async function deleteFile(fileID: string) {
  try {
    await storage.deleteFile(conf.appwriteBucketId, fileID);
    return { status: "Ok" };
  } catch (error) {
    console.log(error);
  }
}
