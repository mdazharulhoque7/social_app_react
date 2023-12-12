import { useAuthContext } from "@/context/AuthContext";
import { multiFormatDateString } from "@/lib/utils";
import { Models } from "appwrite";
import { Link } from "react-router-dom";
import { PostStats } from "@/_root/pages/post";

type PostCardProps = {
  post: Models.Document;
};

const PostCard = ({ post }: PostCardProps) => {
  const { user } = useAuthContext();
  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex gap-3 flex-center">
          <Link to={`/profile/${post.creator.$id}`}>
            <img
              src={
                post?.creator?.imageURL ||
                "/assets/icons/profile-placeholder.svg"
              }
              alt="creator"
              className="w-12 rounded-full lg:h-12"
            />
          </Link>
          <div className="flex flex-col">
            <p className="text-light-1 base-medium lg:body-bold">
              {post.creator.name}
            </p>
            <div className="gap-2 flex-center text-light-3">
              <p className="subtle-semibold lg:small-regular">
                {multiFormatDateString(post.$createdAt)}
              </p>
              -
              <p className="subtle-semibold lg:small-regular">
                {post.location}
              </p>
            </div>
          </div>
        </div>
        <Link
          to={`/post/${post.$id}/edit`}
          className={`${user.id != post.creator.$id && "hidden"}`}
        >
          <img
            src={"/assets/icons/edit.svg"}
            alt="edit"
            width={20}
            height={20}
          />
        </Link>
      </div>
      <Link to={`/post/${post.$id}`}>
        <div className="py-5 small-medium lg:base-medium">
          <p>{post.caption}</p>
          <ul className="flex flex-wrap gap-1 mt-2">
            {post.tags.map((tag: string) => (
              <li key={tag} className="text-light-3">
                #{tag}
              </li>
            ))}
          </ul>
        </div>
        <img
          src={post.imageURL || "/assets/icons/profile-placeholder.svg"}
          className="post-card_img"
          alt="post image"
        />
      </Link>
      <PostStats post={post} userId={user.id} />
    </div>
  );
};

export default PostCard;
