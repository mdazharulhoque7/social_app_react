import * as z from "zod";

export const SignupValidation = z.object({
  name: z.string().min(5, { message: "Too Short" }),
  username: z.string().min(5, { message: "Too Short" }),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be al least 8 characters." }),
});

export const SignInValidation = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be al least 8 characters." }),
});

export const CreatePostValidation = z.object({
  caption: z.string().min(5).max(1024),
  file: z.custom<File[]>(),
  location: z.string().min(2).max(100),
  tags: z.string(),
});
