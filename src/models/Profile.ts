import mongoose, { Document, Types } from "mongoose";

const Schema = mongoose.Schema;

export interface IProfile extends Document {
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
            { type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] },
        ],
        posts: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            default: []
        }],
        bio: { type: String, default: 'Tell us about you' }
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Profile", ProfileSchema);
