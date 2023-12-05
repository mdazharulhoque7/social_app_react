import { ID, Query } from "appwrite";
import { INewUser } from "@/types";
import { account, avatars, databases } from "@/lib/apwrite/config";
import conf from "@/_conf/conf";

export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );

    if (!newAccount) throw Error;

    const avatarURL = avatars.getInitials(user.name);

    const newUser = await createUser({
      accountID: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      imageURL: avatarURL,
    });

    return newUser;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function createUser(user: {
  name: string;
  username?: string;
  email: string;
  imageURL: URL;
  accountID: string;
}) {
  try {
    const newUser = await databases.createDocument(
      conf.appwriteDatabaseId,
      conf.appwriteUserCollectionId,
      ID.unique(),
      user
    );
    return newUser;
  } catch (error) {
    console.log(error);
  }
}

export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailSession(user.email, user.password);
    return session;
  } catch (error) {
    console.log(error);
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwriteUserCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;
    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
  }
}
