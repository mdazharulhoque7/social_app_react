import { Client, Account, Databases, Storage, Avatars } from "appwrite";
import conf from "@/_conf/conf";

// Setting up appwrite client
export const client = new Client();
client.setProject(conf.appwriteProjectId);
client.setEndpoint(conf.appwriteUrl);

export const account = new Account(client);
export const database = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);
