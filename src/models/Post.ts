import mongoose, { Document, Types } from "mongoose";

const Schema = mongoose.Schema;

export interface IPost extends Document {
    content: string, date: Date, likes: { count: number, likedUsers: [{}] };
}

const PostSchema = new Schema(
    {
        content: { type: String, required: true },
        date: { type: Date, default: new Date() },
        likes: {
            count: { type: Number, default: 0 },
            likedUsers: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                }
            ]
        },
        owner: { // у кого на странице пост
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        creater: { // посты могут постить на страницах так же и другие пользователи, как стена Вконтакте
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        comments: [
            {
                creater: { // чей профиль
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                    unique: true
                },
                content: String,
                default: []
            },
            
        ]
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Post", PostSchema);
