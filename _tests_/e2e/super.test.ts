import request from 'supertest'

import {HTTP_STATUSES} from "../../src/const/HTTP response status codes";
import {
    createdDataBlog_02,
    dataForComparisonBlog_01,
    dataForComparisonBlog_02,
    dataForComparisonBlog_03,
    dataForComparisonBlog_04,
    dataForComparisonBlog_05,
    dataForComparisonUser_01,
    dataForCreateBlog_01,
    dataForCreateBlog_02,
    dataForCreateBlog_03,
    dataForCreateBlog_04,
    dataForCreateBlog_05,
    dataForCreatePost_01,
    dataForCreatePost_02,
    dataForCreateUser_01,
    dataForCreateUser_02,
    dataForCreateUser_03,
    dataForCreateUser_04,
    dataForCreateUser_05, dataForCreateUser_06, dataForCreateUser_07,
    dataForUpdateBlog_01,
    incorrectDataForCreateBlog_01,
    incorrectDataForCreateBlog_02,
    incorrectDataForCreatePost_01,
    incorrectDataForCreatePost_03,
    paginationDataBlogs,
    paginationDataPosts, paginationDataUsers
} from "./testing_data";
import {BlogsViewType} from "../../src/types/blogs_types";
import {
    errorByLogin, errorByLoginAndPassword,
    errorByName,
    errorByNameAndYoutubeUrl, errorByTitle,
    errorByTitleAndShortDescription, errorByTitleAndShortDescriptionAndContentAndBlogId
} from "./errorsMessages_data";
import {PostsViewType} from "../../src/types/posts_types";
import {UsersViewType} from "../../src/types/users_types";
import {client} from "../../src/repositories/db";
import {app} from "../../src/app-config";
import {response} from "express";


describe('handtests', () => {

    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
        expect(HTTP_STATUSES.NO_CONTENT_204)
    })
    afterAll(async ()=>{
        await client.close()
    })

    describe('blogs_01', () => {
        it(`01 - should create new blog; status 201; content: created blog`, async () => {
            const createResponse = await request(app)
                .post('/blogs/')
                .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
                .send(dataForCreateBlog_01)
                .expect(HTTP_STATUSES.CREATED_201)

            const createBlog: BlogsViewType = createResponse.body
            expect(createBlog).toEqual(dataForComparisonBlog_01)
        })
        it(`02 - should create new post for specific blog; status 201; content: created post; used additional methods: POST -> /blogs, GET -> /posts/:id`, async () => {
            const createResponse_02 = await request(app)
                .post('/blogs/')
                .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
                .send(dataForCreateBlog_02)
                .expect(HTTP_STATUSES.CREATED_201);
            const createBlog_02: BlogsViewType = createResponse_02.body
            expect(createBlog_02).toEqual(dataForComparisonBlog_02)
            const result = await request(app)
                .get(`/blogs/${createBlog_02.id}`)
                .expect(HTTP_STATUSES.OK_200);

            expect(result.body).toEqual(createdDataBlog_02)
        })
        it(`03 - POST, GET -> "/blogs/:blogId/posts": should return error if :id from uri param not found; status 404`, async () => {
            await request(app)
                .post(`/blogs/543646efv/posts`)
                .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
                .send(dataForCreatePost_01)
                .expect(HTTP_STATUSES.NOT_FOUND_404);
            await request(app)
                .get(`/blogs/ffdsaf53236/posts`)
                .expect(HTTP_STATUSES.NOT_FOUND_404);
        })
        it(`04 - GET -> "/blogs/:blogId/posts": should return status 200; content: posts for specific blog with pagination; used additional methods: POST -> /blogs, POST -> /posts`, async () => {
            const createResponse = await request(app)
                .post('/blogs/')
                .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
                .send(dataForCreateBlog_03)
                .expect(HTTP_STATUSES.CREATED_201);
            const createBlog_03: BlogsViewType = createResponse.body
            expect(createBlog_03).toEqual(dataForComparisonBlog_03)
            const createResponsePost = await request(app)
                .post('/posts/')
                .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
                .send({
                    title: "01 - Way of the Samurai",
                    shortDescription: "have basic knowledge of JS",
                    content: "I just forgot to say: from the start you need to have basic knowledge of JS",
                    blogId: createBlog_03.id,
                }) //dataForCreatePost_02
                .expect(HTTP_STATUSES.CREATED_201);

            expect(createResponsePost.body).toEqual({
                id: expect.any(String),
                title: "01 - Way of the Samurai",
                shortDescription: "have basic knowledge of JS",
                content: "I just forgot to say: from the start you need to have basic knowledge of JS",
                blogId: createBlog_03.id,
                blogName: createBlog_03.name,
                createdAt: expect.any(String)
            })
            const result = await request(app)
                .get(`/blogs/${createBlog_03.id}/posts`)
                .expect(HTTP_STATUSES.OK_200);
            expect(result.body).toEqual({
                "pagesCount": 1,
                "page": 1,
                "pageSize": 10,
                "totalCount": 1,
                "items": [{
                    id: expect.any(String),
                    title: "01 - Way of the Samurai",
                    shortDescription: "have basic knowledge of JS",
                    content: "I just forgot to say: from the start you need to have basic knowledge of JS",
                    blogId: createBlog_03.id,
                    blogName: createBlog_03.name,
                    createdAt: expect.any(String)
                }]
            })

        })
        it(`05 - DELETE -> "/testing/all-data": should remove all data; status 204`, async () => {
            await request(app).delete('/testing/all-data')
            expect(HTTP_STATUSES.NO_CONTENT_204)
        })
    })
    describe('blogs_02', () => {
        it(`06 - GET -> "blogs": should return status 200; content: blog array with pagination; used additional methods: POST -> /blogs, GET -> /blogs`, async () => {
            const createResponse = await request(app)
                .post('/blogs/')
                .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
                .send(dataForCreateBlog_03)
                .expect(HTTP_STATUSES.CREATED_201);
            const createBlog: BlogsViewType = createResponse.body

            expect(createBlog).toEqual(dataForComparisonBlog_03)

            const result = await request(app)
                .get('/blogs/')
                .expect(HTTP_STATUSES.OK_200);

            expect(result.body).toEqual(paginationDataBlogs)
        })
        it(`07 - POST -> "/blogs/:blogId/posts": should return error if auth credentials is incorrect; status 401; used additional methods: POST -> /blogs`, async () => {
            const createResponse = await request(app)
                .post('/blogs/')
                .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
                .send(dataForCreateBlog_01)
                .expect(HTTP_STATUSES.CREATED_201);
            const createBlog: BlogsViewType = createResponse.body

            expect(createBlog).toEqual(dataForComparisonBlog_01)
            await request(app)
                .post(`/blogs/${createResponse.body.id}/posts`)
                .set('Authorization', `Basic wwwYWRtaW46cXdlcnR5`)//add_www
                .send(dataForCreatePost_01)
                .expect(HTTP_STATUSES.UNAUTHORIZED_401);
        })
        it(`08 - GET -> "blogs/:id": should return status 200; content: blog by id; used additional methods: POST -> /blogs`, async () => {
            const createResponse = await request(app)
                .post('/blogs/')
                .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
                .send(dataForCreateBlog_02)
                .expect(HTTP_STATUSES.CREATED_201);
            const createBlog: BlogsViewType = createResponse.body

            expect(createBlog).toEqual(dataForComparisonBlog_02)

            const result = await request(app)
                .get(`/blogs/${createResponse.body.id}`)
                .expect(HTTP_STATUSES.OK_200);

            expect(result.body).toEqual(createBlog)
        })
        it(`09 - PUT -> "/blogs/:id": should update blog by id; status 204; used additional methods: POST -> /blogs, GET -> /blogs/:id`, async () => {
            const createResponse = await request(app)
                .post('/blogs/')
                .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
                .send(dataForCreateBlog_04)
                .expect(HTTP_STATUSES.CREATED_201);
            const createBlog: BlogsViewType = createResponse.body

            expect(createBlog).toEqual(dataForComparisonBlog_04)
            const result = await request(app)
                .get(`/blogs/${createBlog.id}`)
                .expect(HTTP_STATUSES.OK_200);
            expect(result.body).toEqual(createBlog)

            await request(app)
                .put(`/blogs/${createBlog.id}`)
                .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
                .send(dataForUpdateBlog_01)
                .expect(HTTP_STATUSES.NO_CONTENT_204)
        })
        it(`10 - DELETE -> "/blogs/:id": should delete blog by id; status 204; used additional methods: POST -> /blogs, GET -> /blogs/:id`, async () => {
            const createResponse = await request(app)
                .post('/blogs/')
                .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
                .send(dataForCreateBlog_05)
                .expect(HTTP_STATUSES.CREATED_201);
            const createBlogs: BlogsViewType = createResponse.body
            const result = await request(app)
                .get(`/blogs/${createBlogs.id}`)
                .expect(HTTP_STATUSES.OK_200);
            expect(result.body).toEqual(dataForComparisonBlog_05)
            await request(app)
                .delete(`/blogs/${createResponse.body.id}`)
                .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
                .expect(HTTP_STATUSES.NO_CONTENT_204)

        })
        it(`11 - PUT, DELETE, GET -> "/blogs/:id": should return error if :id from uri param not found; status 404`, async () => {
            await request(app)
                .put(`/blogs/4354353`)
                .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
                .send(dataForUpdateBlog_01)
                .expect(HTTP_STATUSES.NOT_FOUND_404);
            await request(app)
                .get(`/blogs/43543d53`)
                .expect(HTTP_STATUSES.NOT_FOUND_404);
            await request(app)
                .delete(`/blogs/43543d53`)
                .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
                .expect(HTTP_STATUSES.NOT_FOUND_404);
        })
        it(`12 find all created blogs`, async () => {
            const result = await request(app)
                .get(`/blogs`)
            const model = result.body as { items: BlogsViewType[] }
            expect(model.items.length).toBe(4)
        })
        it(`13 - DELETE -> "/testing/all-data": should remove all data; status 204`, async () => {
            await request(app).delete('/testing/all-data')
            expect(HTTP_STATUSES.NO_CONTENT_204)
        })
    })
    describe('blogs_03', () => {
        it(`14 find all created blogs`, async () => {
            const result = await request(app)
                .get(`/blogs`)
            const model = result.body as { items: BlogsViewType[] }
            expect(model.items.length).toBe(0)
        })
        it(`15 - PUT, POST, DELETE -> "/blogs": should return error if auth credentials is incorrect; status 401;`, async () => {
            const createResponse = await request(app)
                .post('/blogs/')
                .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
                .send(dataForCreateBlog_01)
                .expect(HTTP_STATUSES.CREATED_201)
            const createBlog: BlogsViewType = createResponse.body

            await request(app)
                .put(`/blogs/${createBlog.id}`)
                .set('Authorization', `Basic qwerYWRtaW46cXdlcnR5`)   ///qwer
                .send(dataForCreateBlog_02)
                .expect(HTTP_STATUSES.UNAUTHORIZED_401, "Unauthorized");
            await request(app)
                .post(`/blogs`)
                .set('Authorization', `Basic qwYWRtaW46cXdlcnR5`)//qw
                .send(dataForCreateBlog_02)
                .expect(HTTP_STATUSES.UNAUTHORIZED_401,"Unauthorized");
            await request(app)
                .delete(`/blogs/${createBlog.id}`)
                .set('Authorization', `Basic qwYWRtaW46cXdlcnR5`)//qw
                .expect(HTTP_STATUSES.UNAUTHORIZED_401,"Unauthorized");
        })
        it(`16 - POST -> "/blogs": should return error if passed body is incorrect; status 400`, async () => {
            await request(app)
                .post('/blogs/')
                .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
                .send(incorrectDataForCreateBlog_01)
                .expect(HTTP_STATUSES.BAD_REQUEST_400, errorByName)
            await request(app)
                .post('/blogs/')
                .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
                .send(incorrectDataForCreateBlog_02)
                .expect(HTTP_STATUSES.BAD_REQUEST_400, errorByNameAndYoutubeUrl)
        })
        it(`17 - PUT -> "/blogs/:id": should return error if passed body is incorrect; status 400; used additional methods: POST -> /blogs`, async () => {
            const createResponse = await request(app)
                .post('/blogs/')
                .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
                .send({
                    name: "123",
                    youtubeUrl: "https://www.youtube.com/watch?v=vuzKKCYXISA"
                })
                .expect(HTTP_STATUSES.CREATED_201);
            await request(app)
                .put(`/blogs/${createResponse.body.id}`)
                .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
                .send(incorrectDataForCreateBlog_01)
                .expect(HTTP_STATUSES.BAD_REQUEST_400, errorByName)
            await request(app)
                .put(`/blogs/${createResponse.body.id}`)
                .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
                .send(incorrectDataForCreateBlog_02)
                .expect(HTTP_STATUSES.BAD_REQUEST_400, errorByNameAndYoutubeUrl)
        })
        it(`18 - POST -> "/blogs/:blogId/posts": should return error if passed body is incorrect; status 400; used additional methods: POST -> /blogs`, async () => {
            const createResponse = await request(app)
                .post('/blogs/')
                .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
                .send(dataForCreateBlog_05)
                .expect(HTTP_STATUSES.CREATED_201);
            const createdBlog: BlogsViewType = createResponse.body
            await request(app)
                .post(`/blogs/${createdBlog.id}/posts`)
                .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
                .send(incorrectDataForCreatePost_01)
                .expect(HTTP_STATUSES.BAD_REQUEST_400, errorByTitleAndShortDescription)
        })
        it(`19 - DELETE -> "/testing/all-data": should remove all data; status 204`, async () => {
            const result = await request(app)
                .get(`/blogs`)
            const model = result.body as { items: BlogsViewType[] }
            expect(model.items.length).toBe(3)

            await request(app).delete('/testing/all-data')
            expect(HTTP_STATUSES.NO_CONTENT_204)
        })
    })
    describe('posts_01', () => {
        it(`20 - POST -> "/posts": should create new post for an existing blog; status 201; content: created post; used additional methods: POST -> /blogs, GET -> /posts/:id`, async () => {
            const createResponse = await request(app)
                .post('/blogs')
                .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
                .send(dataForCreateBlog_01)
                .expect(HTTP_STATUSES.CREATED_201)
            const createdBlogs: BlogsViewType = createResponse.body

            const result = await request(app)
                .get(`/blogs/${createdBlogs.id}`)
                .expect(HTTP_STATUSES.OK_200);

            expect(result.body).toEqual(dataForComparisonBlog_01)

            const createResponsePost = await request(app)
                .post('/posts/')
                .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
                .send({
                   ...dataForCreatePost_01,
                    blogId: createResponse.body.id
                })
                .expect(HTTP_STATUSES.CREATED_201);
            const createdPost: PostsViewType = createResponsePost.body
            expect(createdPost).toEqual({
                id: expect.any(String),
                title: "01 - Way of the Samurai",
                shortDescription: "have basic knowledge of JS",
                content: "I just forgot to say: from the start you need to have basic knowledge of JS",
                blogId: createResponse.body.id,
                blogName: createResponse.body.name,
                createdAt: expect.any(String)
            })
        })
        it(`21 - GET -> "/posts/:id": should return status 200; content: post by id; used additional methods: POST -> /blogs, POST -> /posts`, async () => {
            const createResponse = await request(app)
                .post('/blogs')
                .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
                .send({
                    name: "345",
                    youtubeUrl: "https://www.345.com/watch?v=vuzKKCYXISA"
                })
                .expect(HTTP_STATUSES.CREATED_201)
            const createResponsePost = await request(app)
                .post('/posts')
                .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
                .send({
                    title: "01 - Way of the Samurai",
                    shortDescription: "have basic knowledge of JS",
                    content: "I just forgot to say: from the start you need to have basic knowledge of JS",
                    blogId: createResponse.body.id
                })
                .expect(HTTP_STATUSES.CREATED_201)
            await request(app)
                .get(`/posts/${createResponsePost.body.id}`)
                .expect(HTTP_STATUSES.OK_200)
            expect(createResponsePost.body).toEqual({
                id: expect.any(String),
                title: "01 - Way of the Samurai",
                shortDescription: "have basic knowledge of JS",
                content: "I just forgot to say: from the start you need to have basic knowledge of JS",
                blogId: createResponse.body.id,
                blogName: createResponse.body.name,
                createdAt: expect.any(String)
            })

        })
        it(`22 - PUT -> "/posts/:id": should update post by id; status 204; used additional methods: POST -> /blogs, POST -> /posts, GET -> /posts/:id`, async () => {
            const createResponse = await request(app)
                .post('/blogs')
                .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
                .send(dataForCreateBlog_02)
                .expect(HTTP_STATUSES.CREATED_201)
            const createdBlog: BlogsViewType = createResponse.body
            const createResponsePost = await request(app)
                .post('/posts')
                .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
                .send({
                    title: "01 - Way of the Samurai",
                    shortDescription: "have basic knowledge of JS",
                    content: "I just forgot to say: from the start you need to have basic knowledge of JS",
                    blogId: createdBlog.id,
                })
                .expect(HTTP_STATUSES.CREATED_201)
            const createdPost: PostsViewType = createResponsePost.body

            await request(app)
                .put(`/posts/${createdPost.id}`)
                .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
                .send({
                    title: "fsgdgdsgf",
                    shortDescription: "gfdsgdfg",
                    content: "ljbgepbglfdbsjlbg/lfjgdf",
                    blogId: createdBlog.id,
                })
                .expect(HTTP_STATUSES.NO_CONTENT_204)
        })
        it(`23 - DELETE -> "/posts/:id": should delete post by id; status 204; used additional methods: POST -> /blogs, POST -> /posts, GET -> /posts/:id`, async () => {
            const createResponse = await request(app)
                .post('/blogs')
                .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
                .send(dataForCreateBlog_03)
                .expect(HTTP_STATUSES.CREATED_201)
            const createdBlog: BlogsViewType = createResponse.body
            const createResponsePost = await request(app)
                .post('/posts')
                .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
                .send({
                    title: "01 - Way of the Samurai",
                    shortDescription: "have basic knowledge of JS",
                    content: "I just forgot to say: from the start you need to have basic knowledge of JS",
                    blogId: createdBlog.id,
                })
                .expect(HTTP_STATUSES.CREATED_201)
            const createdPost: PostsViewType = createResponsePost.body

            await request(app)
                .delete(`/posts/${createdPost.id}`)
                .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
                .expect(HTTP_STATUSES.NO_CONTENT_204)
        })
        it(`24 - PUT, DELETE, GET -> "/posts/:id": should return error if :id from uri param not found; status 404; used additional methods: POST -> /blogs;`, async () => {
            await request(app)
                .post('/blogs')
                .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
                .send(dataForCreateBlog_04)
                .expect(HTTP_STATUSES.CREATED_201)

            await request(app)
                .put(`/posts/4354353`)
                .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
                .send(dataForUpdateBlog_01)
                .expect(HTTP_STATUSES.NOT_FOUND_404);
            await request(app)
                .get(`/posts/43543d53`)
                .expect(HTTP_STATUSES.NOT_FOUND_404);
            await request(app)
                .delete(`/posts/43543d53`)
                .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
                .expect(HTTP_STATUSES.NOT_FOUND_404);
        })
        it(`25 - PUT, POST, DELETE -> "/posts": should return error if auth credentials is incorrect; status 401; used additional methods: POST -> /blogs;`, async () => {
            const createResponse = await request(app)
                .post('/blogs/')
                .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
                .send(dataForCreateBlog_05)
                .expect(HTTP_STATUSES.CREATED_201)
            const createBlog: BlogsViewType = createResponse.body

            await request(app)
                .post(`/posts`)
                .set('Authorization', `Basic qwYWRtaW46cXdlcnR5`)//qw
                .send(dataForCreatePost_02)
                .expect(HTTP_STATUSES.UNAUTHORIZED_401,"Unauthorized");
            await request(app)
                .put(`/posts/${createBlog.id}`)
                .set('Authorization', `Basic qwerYWRtaW46cXdlcnR5`)   ///qwer
                .send(dataForCreatePost_01)
                .expect(HTTP_STATUSES.UNAUTHORIZED_401, "Unauthorized");
            await request(app)
                .delete(`/posts/${createBlog.id}`)
                .set('Authorization', `Basic qwYWRtaW46cXdlcnR5`)//qw
                .expect(HTTP_STATUSES.UNAUTHORIZED_401,"Unauthorized");
        })
        it(`26 - DELETE -> "/testing/all-data": should remove all data; status 204`, async () => {
            const resultBlogs = await request(app)
                .get(`/blogs`)
            const modelBlog = resultBlogs.body as { items: BlogsViewType[] }
            expect(modelBlog.items.length).toBe(6)
            const resultPosts = await request(app)
                .get(`/posts`)
            const modelPost = resultPosts.body as { items: PostsViewType[] }
            expect(modelPost.items.length).toBe(3)
            await request(app).delete('/testing/all-data')
            expect(HTTP_STATUSES.NO_CONTENT_204)
        })
    })
    describe ('posts_02', () => {
        it(`27 - GET -> "/posts": should return status 200; content: posts array with pagination; used additional methods: POST -> /blogs, POST -> /posts;`, async () => {
            const createResponse = await request(app)
                .post('/blogs')
                .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
                .send(dataForCreateBlog_01)
                .expect(HTTP_STATUSES.CREATED_201)
            const createdBlogs: BlogsViewType = createResponse.body
            await request(app)
                .post('/posts/')
                .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
                .send({
                    title: "01 - Way of the Samurai",
                    shortDescription: "have basic knowledge of JS",
                    content: "I just forgot to say: from the start you need to have basic knowledge of JS",
                    blogId: createdBlogs.id
                })
                .expect(HTTP_STATUSES.CREATED_201);

            const resultPosts = await request(app)
                .get(`/posts`)
                .expect(HTTP_STATUSES.OK_200)
            expect(resultPosts.body).toEqual(paginationDataPosts)
            const modelPost = resultPosts.body as { items: PostsViewType[] }
            expect(modelPost.items.length).toBe(1)
        })
        it(`28 - POST -> "/posts": should return error if passed body is incorrect; status 400; used additional methods: POST -> /blogs;`, async () => {
            const createResponse = await request(app)
                .post('/blogs')
                .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
                .send(dataForCreateBlog_02)
                .expect(HTTP_STATUSES.CREATED_201)
            const createdBlogs: BlogsViewType = createResponse.body
            await request(app)
                .post('/posts/')
                .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
                .send({
                    title: 123,
                    shortDescription: "have basic knowledge of JS",
                    content: "I just forgot to say: from the start you need to have basic knowledge of JS",
                    blogId: createdBlogs.id
                })
                .expect(HTTP_STATUSES.BAD_REQUEST_400,errorByTitle);
            await request(app)
                .post('/posts/')
                .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
                .send(incorrectDataForCreatePost_03)
                .expect(HTTP_STATUSES.BAD_REQUEST_400, errorByTitleAndShortDescriptionAndContentAndBlogId);
        })
        it(`29 - PUT -> "/posts": should return error if passed body is incorrect; status 400; used additional methods: POST -> /blogs, POST -> /posts;`, async () => {
            const createResponse = await request(app)
                .post('/blogs')
                .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
                .send(dataForCreateBlog_02)
                .expect(HTTP_STATUSES.CREATED_201)
            const createdBlogs: BlogsViewType = createResponse.body
            const createdPost = await request(app)
                .post('/posts/')
                .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
                .send({
                    title: "123",
                    shortDescription: "have basic knowledge of JS",
                    content: "I just forgot to say: from the start you need to have basic knowledge of JS",
                    blogId: createdBlogs.id
                })
                .expect(HTTP_STATUSES.CREATED_201);
            await request(app)
                .put(`/posts/${createdPost.body.id}`)
                .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
                .send({
                    title: 777,
                    shortDescription: "have basic knowledge of JS",
                    content: "I just forgot to say: from the start you need to have basic knowledge of JS",
                    blogId: createdBlogs.id
                })
                .expect(HTTP_STATUSES.BAD_REQUEST_400, errorByTitle);
        })
    })
    describe ('users', () => {
        it(`30 - POST -> "/users": should create new user; status 201; content: created user; used additional methods: GET => /users`, async () => {
            const createResponse = await request(app)
                .post('/users')
                .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
                .send(dataForCreateUser_01)
                .expect(HTTP_STATUSES.CREATED_201)
            expect(createResponse.body).toEqual(dataForComparisonUser_01)
        })
        it(`31 - DELETE -> "/testing/all-data": should remove all data; status 204`, async () => {
            await request(app).delete('/testing/all-data')
            expect(HTTP_STATUSES.NO_CONTENT_204)
        })
        it(`32 - GET -> "/users": should return status 200; content: users array with pagination; used additional methods: POST -> /users, DELETE -> /users;`, async () => {
            const createResponse = await request(app)
                .post('/users')
                .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
                .send(dataForCreateUser_01)
                .expect(HTTP_STATUSES.CREATED_201)
            await request(app)
                .delete(`/users/${createResponse.body.id}`)
                .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
                .expect(HTTP_STATUSES.NO_CONTENT_204)
            const resultUsers = await request(app)
                .get(`/users`)
            const modelUsers = resultUsers.body as { items: UsersViewType[] }
            expect(modelUsers.items.length).toBe(0)
        })
        it(`33 - POST, DELETE -> "/users": should return error if auth credentials is incorrect; status 401; used additional methods: POST -> /users;`, async () => {
            const createResponse = await request(app)
                .post('/users')
                .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
                .send(dataForCreateUser_02)
                .expect(HTTP_STATUSES.CREATED_201)
            await request(app)
                .delete(`/users/${createResponse.body.id}`)
                .set('Authorization', `Basic qwYWRtaW46cXdlcnR5`)//
                .expect(HTTP_STATUSES.UNAUTHORIZED_401,'Unauthorized')
        })
        it(`34 - DELETE -> "/users/:id": should delete user by id; status 204; used additional methods: POST -> /users, GET -> /users`, async () => {
            const createResponse = await request(app)
                .post('/users')
                .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
                .send(dataForCreateUser_03)
                .expect(HTTP_STATUSES.CREATED_201)
            await request(app)
                .get(`/users`)
                .expect(HTTP_STATUSES.OK_200)
            await request(app)
                .delete(`/users/${createResponse.body.id}`)
                .set('Authorization', `Basic YWRtaW46cXdlcnR5`)//
                .expect(HTTP_STATUSES.NO_CONTENT_204)
        })
        it(`35 - DELETE -> "/users/:id": should return error if :id from uri param not found; status 404`, async () => {
            await request(app)
                .post('/users')
                .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
                .send(dataForCreateUser_04)
                .expect(HTTP_STATUSES.CREATED_201)
            await request(app)
                .delete(`/users/fsfg`)
                .set('Authorization', `Basic YWRtaW46cXdlcnR5`)//
                .expect(HTTP_STATUSES.NOT_FOUND_404)
        })
        it(`36 - POST -> "/users": should return error if passed body is incorrect; status 400`, async () => {
            await request(app)
                .post('/users')
                .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
                .send(dataForCreateUser_05)
                .expect(HTTP_STATUSES.BAD_REQUEST_400, errorByLogin)
            await request(app)
                .post('/users')
                .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
                .send(dataForCreateUser_06)
                .expect(HTTP_STATUSES.BAD_REQUEST_400, errorByLoginAndPassword)

        })
        it(`37 - POST -> "/users": should create new user; status 201; content: created user; used additional methods: GET => /users;`, async () => {
            await request(app)
                .post('/users')
                .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
                .send(dataForCreateUser_07)
                .expect(HTTP_STATUSES.CREATED_201);

            const resultByUsers = await request(app)
                .get('/users')
                .expect(HTTP_STATUSES.OK_200);
            const modelUser = resultByUsers.body as { items: UsersViewType[] }
            expect(modelUser.items.length).toBe(3)
            expect(resultByUsers.body).toEqual(paginationDataUsers)
        })
    })
    describe(`Auth`,()=>{
        it(`38 - POST -> "/auth/login": should sign in user; status 204;`, async () => {
            const resultUsers = await request(app)
                .get(`/users`)
            const modelUsers = resultUsers.body as { items: UsersViewType[] }
            expect(modelUsers.items.length).toBe(0)

            await request(app)
                .post(`/auth/login`)
                .send({
                    login: "Belarus",
                    password: "jiveBelarus2020"
                })
                .expect(function(res) {
                    res.body.login = "Belarus";
                    res.body.password = "jiveBelarus2020";
                })

            expect(response.statusCode).toBe( 200 )

           // expect(response.).toMatch(/json/)
            //expect(response.headers["Content-Type"]).toMatch(/json/)
            //expect(loginUserResponseData.accessToken).toEqual(expect.stringContaining('.'));

            //expect(resultUsers.body).toEqual(paginationDataUsers)
        })
        it(`39 - POST -> "/auth/login": should return error if passed wrong login or password; status 401;`, async () => {
          await request(app)
                .post(`/auth/login`)
                .send({
                    login: "Belarus2",
                    password: "jiveBelarus2020"
                })
                .expect(HTTP_STATUSES.UNAUTHORIZED_401);
        })
    })
})







