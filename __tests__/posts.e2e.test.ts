import {
    createBlog,
    createComment,
    createNewUserModel,
    createPost,
    createUser,
    generateString,
    requestApp
} from "./utils";
import {BlogViewModel, PostViewModel, Status, UserViewModel} from "../src/types";
import {CommentCreateRequestModel, CommentViewModel} from "../src/types/comments";
import {createAccessToken} from "../src/utils/tokenAdapter";
import {connectDisconnectDb, connectMongooseDb} from "../src/db";
import {LikeStatus, LikeStatusUpdateModel} from "../src/types/likes";

let blog: BlogViewModel | null = null;
let post: PostViewModel | null = null;
let user: UserViewModel | null = null;
let comment: CommentViewModel | null = null;

describe("posts testing", () => {

    beforeAll(async () => {
        await connectMongooseDb();
        await requestApp.delete("/testing/all-data");
        user = await createUser(createNewUserModel());
        blog = await createBlog(user.id);
        post = await createPost(user.id, blog.id);
        comment = await createComment(post.id, user.id, {
            content: generateString(20)
        });
    })

    afterAll(async () => {
        await connectDisconnectDb();
    });

    it("should create comment", async () => {

        expect(blog).not.toBeNull();
        expect(post).not.toBeNull();
        expect(user).not.toBeNull();

        if (blog && post && user) {
            await requestApp
                .post(`/posts/${post.id}/comments`)
                .set('Authorization', 'Bearer ' + createAccessToken(user.id).token)
                .set('Content-Type', 'application/json')
                .send({
                    content: generateString(20)
                } as CommentCreateRequestModel)
                .expect(Status.CREATED);
        }

    })

    it("should return 1 like after 2 likes", async () => {

        expect(blog).not.toBeNull();
        expect(post).not.toBeNull();
        expect(user).not.toBeNull();

        if (blog && post && user) {
            const user1 = await createUser(createNewUserModel());

            await requestApp
                .put(`/posts/${post.id}/like-status`)
                .set('Authorization', 'Bearer ' + createAccessToken(user1.id).token)
                .set('Content-Type', 'application/json')
                .send({
                    likeStatus: LikeStatus.LIKE
                } as LikeStatusUpdateModel)

            await requestApp
                .put(`/posts/${post.id}/like-status`)
                .set('Authorization', 'Bearer ' + createAccessToken(user1.id).token)
                .set('Content-Type', 'application/json')
                .send({
                    likeStatus: LikeStatus.LIKE
                } as LikeStatusUpdateModel)


            const res =  await requestApp
                .get(`/posts/${post.id}`)
                .set('Authorization', 'Bearer ' + createAccessToken(user1.id).token)
                .set('Content-Type', 'application/json');

            console.log(JSON.stringify(res.body, null, 4))

            expect(res.body.extendedLikesInfo).toEqual({
                likesCount: 1,
                dislikesCount: 0,
                myStatus: "Like",
                newestLikes: expect.any(Array)
            })

            expect(res.body.extendedLikesInfo.newestLikes).toHaveLength(1)

        }

    })

    it("should return extended likes", async () => {

        expect(blog).not.toBeNull();
        expect(post).not.toBeNull();
        expect(user).not.toBeNull();

        if (blog && post && user) {
            await requestApp
                .put(`/posts/${post.id}/like-status`)
                .set('Authorization', 'Bearer ' + createAccessToken(user.id).token)
                .set('Content-Type', 'application/json')
                .send({
                    likeStatus: LikeStatus.LIKE
                } as LikeStatusUpdateModel)


            const user2 = await createUser(createNewUserModel());


            await requestApp
                .put(`/posts/${post.id}/like-status`)
                .set('Authorization', 'Bearer ' + createAccessToken(user2.id).token)
                .set('Content-Type', 'application/json')
                .send({
                    likeStatus: LikeStatus.DISLIKE
                } as LikeStatusUpdateModel)

            const user3 = await createUser(createNewUserModel());

            await requestApp
                .put(`/posts/${post.id}/like-status`)
                .set('Authorization', 'Bearer ' + createAccessToken(user3.id).token)
                .set('Content-Type', 'application/json')
                .send({
                    likeStatus: LikeStatus.DISLIKE
                } as LikeStatusUpdateModel)

            const user4 = await createUser(createNewUserModel());

            await requestApp
                .put(`/posts/${post.id}/like-status`)
                .set('Authorization', 'Bearer ' + createAccessToken(user4.id).token)
                .set('Content-Type', 'application/json')
                .send({
                    likeStatus: LikeStatus.LIKE
                } as LikeStatusUpdateModel)

            await requestApp
                .put(`/posts/${post.id}/like-status`)
                .set('Authorization', 'Bearer ' + createAccessToken(user4.id).token)
                .set('Content-Type', 'application/json')
                .send({
                    likeStatus: LikeStatus.DISLIKE
                } as LikeStatusUpdateModel)

           const res =  await requestApp
                .get(`/posts/${post.id}`)
                .set('Authorization', 'Bearer ' + createAccessToken(user4.id).token)
                .set('Content-Type', 'application/json');

           console.log(JSON.stringify(res.body, null, 4))
        }

    })

    it("should 400 if passed body is incorrect", async () => {

        expect(blog).not.toBeNull();
        expect(post).not.toBeNull();
        expect(user).not.toBeNull();

        if (blog && post && user) {
            await requestApp
                .post(`/posts/${post.id}/comments`)
                .set('Authorization', 'Bearer ' + createAccessToken(user.id).token)
                .set('Content-Type', 'application/json')
                .send({
                    content: generateString(6)
                } as CommentCreateRequestModel)
                .expect(Status.BAD_REQUEST);

            await requestApp
                .post(`/posts/${post.id}/comments`)
                .set('Authorization', 'Bearer ' + createAccessToken(user.id).token)
                .set('Content-Type', 'application/json')
                .send({
                    content: generateString(400)
                } as CommentCreateRequestModel)
                .expect(Status.BAD_REQUEST);
        }

    })

    it("should 401 user unathorized", async () => {

        expect(blog).not.toBeNull();
        expect(post).not.toBeNull();

        if (blog && post) {
            await requestApp
                .post(`/posts/${post.id}/comments`)
                .set('Content-Type', 'application/json')
                .send({
                    content: generateString(20)
                } as CommentCreateRequestModel)
                .expect(Status.UNATHORIZED);

        }

    })

    it("should 404 if postId not exist", async () => {

        expect(blog).not.toBeNull();
        expect(post).not.toBeNull();
        expect(user).not.toBeNull();
        const fakePostId = "64b92eac872655d706c510f1";

        if (blog && post && user) {
            await requestApp
                .post(`/posts/${fakePostId}/comments`)
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer ' + createAccessToken(user.id).token)
                .send({
                    content: generateString(20)
                } as CommentCreateRequestModel)
                .expect(Status.NOT_FOUND);

        }

    })

    it("should 200 post comment exist", async () => {

        expect(blog).not.toBeNull();
        expect(post).not.toBeNull();
        expect(user).not.toBeNull();

        if (blog && post && user) {
            await requestApp
                .get(`/posts/${post.id}/comments`)
                .set('Content-Type', 'application/json')
                .expect(Status.OK);
        }

    })

    it("should 404 post not exist", async () => {

        expect(blog).not.toBeNull();
        expect(post).not.toBeNull();
        expect(user).not.toBeNull();
        const fakePostId = "64c3b8d60d815dc4a0f6b1d0";

        if (blog && post && user) {
            await requestApp
                .get(`/posts/${fakePostId}/comments`)
                .set('Content-Type', 'application/json')
                .expect(Status.NOT_FOUND);
        }

    })

})