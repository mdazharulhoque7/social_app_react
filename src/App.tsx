import { Routes, Route } from "react-router-dom";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Home } from "./_root/pages";
import SigninForm from "./_auth/forms/SigninForm";
import SignupForm from "./_auth/forms/SignupForm";
import AuthLayout from "./_auth/AuthLayout";
import RootLayout from "./_root/RootLayout";
import {
  CreatePost,
  EditPost,
  ExplorePost,
  LikedPost,
  PostDetail,
  SavedPost,
} from "./_root/pages/post";
import { EditProfile, Profile, User } from "./_root/pages/user";

const App = () => {
  return (
    <main className="flex h-screen">
      <Routes>
        {/* public routes */}
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<SigninForm />} />
          <Route path="/sign-up" element={<SignupForm />} />
        </Route>

        {/* protected routes */}
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="/post" element={<ExplorePost />} />
          <Route path="/post/create" element={<CreatePost />} />
          <Route path="/post/:id/*" element={<PostDetail />} />
          <Route path="/post/:id/edit" element={<EditPost />} />
          <Route path="/post/saved" element={<SavedPost />} />
          <Route path="/post/liked" element={<LikedPost />} />
          <Route path="/user" element={<User />} />
          <Route path="/user/profile/:id/*" element={<Profile />} />
          <Route path="/user/profile/:id/edit" element={<EditProfile />} />
        </Route>
      </Routes>
      <Toaster />
    </main>
  );
};

export default App;
