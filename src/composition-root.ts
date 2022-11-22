import {BlogsRepositories} from "./repositories/blogs-db-repositories";
import {PostsRepositories} from "./repositories/posts-db-repositories";
import {DeviceRepositories} from "./repositories/device-db-repositories";
import {UsersRepositories} from "./repositories/users-db-repositories";
import {CommentsRepositories} from "./repositories/comments-db-repositories";
import {BlogsQueryRepositories} from "./repositories/blogs-query-repositories";
import {PostsQueryRepositories} from "./repositories/posts-query-repositories";
import {CommentsQueryRepositories} from "./repositories/comments-query-repositories";
import {UsersQueryRepositories} from "./repositories/users-query-repositories";
import {DeviceQueryRepositories} from "./repositories/device-query-repositories";
import {IpRepositories} from "./repositories/ip-db-repositories";
import {BlogsService} from "./domain/blogs-service";
import {PostsService} from "./domain/posts-service";
import {CommentsService} from "./domain/comments-service";
import {DeviceService} from "./domain/device-service";
import {UsersService} from "./domain/users-service";


const blogsRepositories = new BlogsRepositories()
export const blogsQueryRepositories = new BlogsQueryRepositories()
const postsRepository = new PostsRepositories()
export const postsQueryRepositories = new PostsQueryRepositories()
export const deviceRepositories = new DeviceRepositories()
export const deviceQueryRepositories = new DeviceQueryRepositories()
export const usersRepositories = new UsersRepositories()
export const usersQueryRepositories = new UsersQueryRepositories()
export const ipRepositories = new IpRepositories()
const commentsRepositories = new CommentsRepositories()
export const commentsQueryRepositories = new CommentsQueryRepositories()

export const blogsService = new BlogsService(blogsRepositories, postsRepository)
export const postsService = new PostsService(postsRepository, commentsRepositories)
export const commentsService = new CommentsService(commentsRepositories)
export const deviceService = new DeviceService(deviceRepositories)
export const usersService = new UsersService(usersRepositories, deviceRepositories)


