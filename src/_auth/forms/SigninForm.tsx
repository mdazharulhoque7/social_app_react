import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { SignInValidation } from "@/lib/validation";
import Loader from "@/components/shared/Loader";
import { Link, useNavigate } from "react-router-dom";
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/auth";
import { useAuthContext } from "@/context/AuthContext";

const SignInForm = () => {
  const { toast } = useToast();
  const { checkAuthUser, isLoading: isUserLoading } = useAuthContext();
  const { mutateAsync: signInAccount, isPending: isSigningIn } =
    useSignInAccount();

  const navigate = useNavigate();

  // 1. Define your form.
  const form = useForm<z.infer<typeof SignInValidation>>({
    resolver: zodResolver(SignInValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SignInValidation>) {
    const session = await signInAccount({
      email: values.email,
      password: values.password,
    });

    if (!session) {
      return toast({
        variant: "destructive",
        title: "Sign in failed!",
        description: "Please try again later.",
      });
    }

    const isLoggedIn = await checkAuthUser();
    if (isLoggedIn) {
      form.reset();
      navigate("/");
    } else {
      return toast({
        variant: "destructive",
        title: "Sign in failed!",
        description: "Please try again later.",
      });
    }
  }

  return (
    <Form {...form}>
      <div className="flex-col sm:w-420 flex-center">
        <img src="assets/images/logo.svg" alt="logo" />
        <h2 className="pt-5 h3-bold md:h2-bold sm:pt-12">
          Log in to your account
        </h2>
        <p className="text-light-3 small-medium md:base-regular">
          Welcome back! Please enter your details
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col w-full gap-5 mt-4"
        >
          {/* email field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* password field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="shad-button_primary">
            {isUserLoading ? (
              <div className="gap-2 flex-center">
                <Loader />
              </div>
            ) : (
              "Sign in"
            )}
          </Button>
          <p className="mt-2 text-center text-small-regular text-light-2">
            Don't have an account?
            <Link
              to="/sign-up"
              className="ml-1 text-primary-500 text-small-semibold"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SignInForm;
