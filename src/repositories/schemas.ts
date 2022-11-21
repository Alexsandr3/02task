import mongoose from "mongoose";
import {BlogsDBType} from "../types/blogs_types";
import {ObjectId} from "mongodb";
import {PostsDBType} from "../types/posts_types";
import {UsersAcountDBType} from "../types/users_types";
import {CommentsDBType} from "../types/comments_types";
import {IpClientDBType} from "../types/ip-client_types";
import {DeviceDBType} from "../types/device_types";

const blogSchema = new mongoose.Schema<BlogsDBType>({
    _id: ObjectId,
    name: {type: String, required: true},
    description: {type: String, required: true},
    websiteUrl: {type: String, required: true},
    createdAt: {type: String, required: true}
});
const postSchema = new mongoose.Schema<PostsDBType>({
    _id: ObjectId,
    title: {type: String, required: true},
    shortDescription: {type: String, required: true},
    content: {type: String, required: true},
    blogId: {type: String, required: true},
    blogName: {type: String, required: true},
    createdAt: {type: String, required: true}
});
const userSchema = new mongoose.Schema<UsersAcountDBType>({
    _id: ObjectId,
    accountData: {
        login: {type: String, required: true},
        email: {type: String, required: true},
        passwordHash: {type: String, required: true},
        createdAt: {type: String, required: true}
    },
    emailConfirmation: {
        confirmationCode: {type: String, required: true},
        expirationDate: Date,
        isConfirmation: Boolean,
        sentEmails: [{sentDate: Date}]
    },
    emailRecovery: {
        recoveryCode: {type: String, required: true},
        expirationDate: Date,
        isConfirmation: Boolean,
        sentEmails: [{sentDate: Date}]
    }
});
const commentSchema = new mongoose.Schema<CommentsDBType>({
    _id: ObjectId,
    postId: {type: String, required: true},
    content: {type: String, required: true},
    userId: {type: String, required: true},
    userLogin: {type: String, required: true},
    createdAt: {type: String, required: true}
});
const ipSchema = new mongoose.Schema<IpClientDBType>({
    _id: ObjectId,
    ip: {type: String, required: true},
    url: {type: String, required: true},
    inputDate: Date
});
const deviceSchema = new mongoose.Schema<DeviceDBType>({
    _id: ObjectId,
    userId: {type: String, required: true},
    ip: {type: String, required: true},
    title: {type: String, required: true},
    lastActiveDate: {type: String, required: true},
    expiredDate: {type: String, required: true},
    deviceId: {type: String, required: true}
});
export const BlogModelClass = mongoose.model('blogs', blogSchema);
export const PostModelClass = mongoose.model('posts', postSchema);
export const UserModelClass = mongoose.model('users', userSchema);
export const CommentModelClass = mongoose.model('comments', commentSchema);
export const IpModelClass = mongoose.model('ip', ipSchema);
export const DeviceModelClass = mongoose.model('device', deviceSchema);