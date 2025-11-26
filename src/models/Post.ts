import mongoose, { Document, Types } from "mongoose";

const Schema = mongoose.Schema;

export interface IPost extends Document {
  content: string;
  likes: {
    count: number;
    likedUsers: Types.ObjectId[];
  };
  owner: Types.ObjectId;
  creater: Types.ObjectId;
  comments: {
    creater: Types.ObjectId;
    content: string;
    createdAt?: Date;
  }[];
  createdAt: Date;
}

const PostSchema = new Schema(
  {
    content: { type: String, required: true },
    likes: {
      count: { type: Number, default: 0 },
      likedUsers: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    owner: {
      // у кого на странице пост
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    creater: {
      // посты могут постить на страницах так же и другие пользователи, как стена Вконтакте
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comments: [
      {
        creater: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true, // рекомендуется добавить
        },
        content: {
          type: String,
          required: true, // рекомендуется добавить
        },
        createdAt: {
          // добавьте timestamp для комментариев
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Post", PostSchema);
