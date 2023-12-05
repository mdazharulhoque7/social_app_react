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
