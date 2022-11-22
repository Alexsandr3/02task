import mongoose from "mongoose";
import {BlogsDBType} from "../types/blogs_types";
import {ObjectId} from "mongodb";
import {PostsDBType} from "../types/posts_types";
import {UsersAcountDBType} from "../types/users_types";
import {CommentsDBType, LikeDBType} from "../types/comments_types";
import {IpClientDBType} from "../types/ip-client_types";
import {DeviceDBType} from "../types/device_types";

const blogSchema = new mongoose.Schema<BlogsDBType>({
    _id: ObjectId,
    name: {type: String, required: true, maxlength: 15, trim: true},
    description: {type: String, required: true, maxlength: 500},
    websiteUrl: {type: String, required: true, maxlength: 100, trim: true},
    createdAt: {type: String, required: true}
});
const postSchema = new mongoose.Schema<PostsDBType>({
    _id: ObjectId,
    title: {type: String, required: true, maxlength: 30, trim: true},
    shortDescription: {type: String, required: true, maxlength: 100},
    content: {type: String, required: true, maxlength: 1000},
    blogId: {type: String, required: true},
    blogName: {type: String, required: true},
    createdAt: {type: String, required: true}
});
const userSchema = new mongoose.Schema<UsersAcountDBType>({
    _id: ObjectId,
    accountData: {
        login: {type: String, required: true, minlength: 3, maxlength: 10},
        email: {type: String, required: true},
        passwordHash: {type: String, required: true},
        createdAt: {type: String, required: true}
    },
    emailConfirmation: {
        confirmationCode: {type: String, required: true},
        expirationDate: Date,
        isConfirmation: {type: Boolean, default: false},
        sentEmails: [{sentDate: Date}]
    },
    emailRecovery: {
        recoveryCode: {type: String, required: true},
        expirationDate: Date,
        isConfirmation: {type: Boolean, default: false},
        sentEmails: [{sentDate: Date}]
    }
});
const commentSchema = new mongoose.Schema<CommentsDBType>({
    _id: ObjectId,
    postId: {type: String, required: true},
    content: {type: String, required: true, minlength: 20, maxlength: 300},
    userId: {type: String, required: true},
    userLogin: {type: String, required: true},
    createdAt: {type: String, required: true},
    likesInfo: [{
        _id: ObjectId,
        userId: {type: String, required: true},
        parentId: {type: String, required: true},
        likeStatus: {type: String, default: "none"}
    }]
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
const likeStatusSchema = new mongoose.Schema<LikeDBType>({
    _id: ObjectId,
    userId: {type: String, required: true},
    parentId: {type: String, required: true},
    likeStatus: {type: String, default: 'none'}
});
export const BlogModelClass = mongoose.model('blogs', blogSchema);
export const PostModelClass = mongoose.model('posts', postSchema);
export const UserModelClass = mongoose.model('users', userSchema);
export const CommentModelClass = mongoose.model('comments', commentSchema);
export const IpModelClass = mongoose.model('ip', ipSchema);
export const DeviceModelClass = mongoose.model('device', deviceSchema);
export const LikeModelClass = mongoose.model('likes', likeStatusSchema);
