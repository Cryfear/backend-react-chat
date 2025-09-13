import mongoose, { Document, Types } from "mongoose";

const Schema = mongoose.Schema;

export interface IProfile extends Document {
    posts: {content: string, date: Date, likes: {count: number, likedUsers: [{}]}};
    date: Date;
    owner: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const ProfileSchema = new Schema(
    {
        owner: { // чей профиль
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },
        friends: [ // друзья пользователя, массив обьектов
            { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        ],
        posts: [ // посты пользователя
            {
                content: {type: String, required: true},
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
                creater: { // посты могут постить на страницах так же и другие пользователи, как стена Вконтакте
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true
                }
            }
        ],
        bio: {type: String, default: 'Tell us about you'}
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Profile", ProfileSchema);
