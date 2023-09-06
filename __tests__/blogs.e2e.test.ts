import supertest from "supertest";
import {app} from "../src/app";
import {BlogViewModel, PostsCreateModel, PostViewModel, Status, UserViewModel} from "../src/types";
import {authBasic64, createNewUserModel, createUser, requestApp, validBlogData, validPostData} from "./utils";
import {connectDisconnectDb, connectMongooseDb} from "../src/db";
import {createAccessToken} from "../src/utils/tokenAdapter";


let createdBlogId: string | null = null;
let createdPostId: string | null = null;
let user: UserViewModel | null = null;

describe("blogs testing", () => {

    beforeAll(async () => {
        await connectMongooseDb();
        createdBlogId = null;
        createdPostId = null;
        user = await createUser(createNewUserModel());
        await supertest(app).delete("/testing/all-data");
    })

    afterAll(async () => {
        await connectDisconnectDb();
    });


    it("should require authorization", async () => {
        await requestApp
            .post("/blogs")
            .set('Content-Type', 'application/json')
            .send({})
            .expect(Status.UNATHORIZED)

        await requestApp
            .delete("/blogs/1")
            .expect(Status.UNATHORIZED)

        await requestApp
            .put("/blogs/1")
            .set('Content-Type', 'application/json')
            .send({})
            .expect(Status.UNATHORIZED)

        await requestApp
            .post("/posts")
            .set('Content-Type', 'application/json')
            .send({})
            .expect(Status.UNATHORIZED)

        await requestApp
            .delete("/posts/1")
            .expect(Status.UNATHORIZED)

        await requestApp
            .put("/posts/1")
            .set('Content-Type', 'application/json')
            .send({})
            .expect(Status.UNATHORIZED)
    })

    it("should return bad request", async () => {

        expect(user).not.toBeNull()

        if (user) {
            await requestApp
                .get("/blogs/1")
                .set('Authorization', 'Bearer ' + createAccessToken(user.id).token)
                .expect(Status.UNHANDLED)
        }

    })

    it("should create blog", async () => {

        expect(user).not.toBeNull()

        if (user) {

            const result = await requestApp
                .post("/blogs")
                .set('Authorization', 'Basic ' + authBasic64)
                .set('Content-Type', 'application/json')
                .send(validBlogData)
                .expect(Status.CREATED);

            const {id} : Pick<BlogViewModel, 'id'> = result.body;

            createdBlogId = id;

            expect(result.body).toEqual({
                id: expect.any(String),
                name: validBlogData.name,
                description: validBlogData.description,
                websiteUrl: validBlogData.websiteUrl,
                isMembership: expect.any(Boolean),
                createdAt: expect.any(String),
            })
        }

    })

    it("should create post", async () => {

        expect(user).not.toBeNull()
        expect(createdBlogId).not.toBeNull();

        if (user) {
            const result = await requestApp
                .post("/posts")
                .set('Authorization', 'Basic ' + authBasic64)
                .set('Content-Type', 'application/json')
                .send({
                    ...validPostData,
                    blogId: createdBlogId,
                } as PostsCreateModel)
                .expect(Status.CREATED);

            const {id}: Pick<PostViewModel, 'id'> = result.body;

            createdPostId = id;

            expect(result.body).toEqual({
                id: expect.any(String),
                blogName: expect.any(String),
                title: validPostData.title,
                shortDescription: validPostData.shortDescription,
                content: validPostData.content,
                blogId: createdBlogId,
                createdAt: expect.any(String),
                extendedLikesInfo: expect.any(Object),
            })
        }

    })

    it("should update post", async () => {

        expect(user).not.toBeNull()
        expect(createdBlogId).not.toBeNull();

        if (user) {

            const newTitle = "new title";

            await requestApp
                .put(`/posts/${createdPostId}`)
                .set('Authorization', 'Basic ' + authBasic64)
                .set('Content-Type', 'application/json')
                .send({
                    title: newTitle,
                    shortDescription: "valid short description",
                    content: "valid content",
                    blogId: createdBlogId
                } as PostsCreateModel)
                .expect(Status.NO_CONTENT)

            const result = await requestApp
                .get(`/posts/${createdPostId}`)
                .set('Content-Type', 'application/json')
                .expect(Status.OK)

            expect(result.body).toEqual({
                id: expect.any(String),
                title: newTitle,
                shortDescription: expect.any(String),
                content: expect.any(String),
                blogName: expect.any(String),
                blogId: expect.any(String),
                createdAt: expect.any(String),
                extendedLikesInfo: expect.any(Object),
            })
        }

    })


})