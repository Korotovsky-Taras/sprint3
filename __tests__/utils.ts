import {
    BlogCreateModel,
    BlogViewModel,
    PostsCommentCreateModel,
    PostsCreateModel,
    PostViewModel,
    UserCreateRequestModel,
    UserViewModel
} from "../src/types";
import {agent, Response} from "supertest";
import {app} from "../src/app";
import {createAccessToken, verifyRefreshToken} from "../src/utils/tokenAdapter";
import {CommentCreateRequestModel, CommentViewModel} from "../src/types/comments";
import setCookie from "set-cookie-parser";
import {AuthRefreshTokenPayload} from "../src/types/login";
import {UUID} from "crypto";

export const requestApp = agent(app);
export const authBasic64 = Buffer.from("admin:qwerty").toString("base64");

export type BlogCreationTestModel = BlogCreateModel;
export type PostCreationTestModel = Omit<PostsCreateModel, 'blogId' | 'blogName'>;
export type CommentCreationTestModel = PostsCommentCreateModel;
export type UserCreationTestModel = UserCreateRequestModel;

export const validBlogData: BlogCreationTestModel = {
    name: "Taras",
    description: "valid",
    websiteUrl: "https://app.by"
}

export const validPostData: PostCreationTestModel = {
    title: "valid title",
    shortDescription: "valid short description",
    content: "valid content",
}

export const validUserData: UserCreationTestModel = {
    login: "taras",
    email: "taras@gmail.com",
    password: "Q12345q"
}

export const validCommentData: CommentCreationTestModel = {
    content: "valid content of comment by lorem ipsum",
}

export type Cookie = {
    value: string,
}

export type SessionUnit = {
    uuid: UUID,
    payload: AuthRefreshTokenPayload,
    refreshToken: string
}

export function refreshCookie(cookie: Cookie | undefined, session: SessionUnit) {
    if (!cookie || !cookie.value) {
        throw Error("Refresh cookie error")
    }
    const payload: AuthRefreshTokenPayload | null = verifyRefreshToken(cookie.value);
    if (payload) {
        session.payload = payload;
        session.refreshToken = cookie.value;
    }
}


export function generateString(length = 20) : string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let string: string = '';
    for (let i = 0; i < length; i++) {
        string += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return string;
}

export function generateCredentials(loginLength = 8, passwordLength = 8) : {login: string, password: string} {
    // Generate random login and password
    return { login: generateString(loginLength), password: generateString(passwordLength) };
}


export const createNewUserModel = () : UserCreationTestModel => {
    const {login, password} = generateCredentials();
    return {
        email: `${login}@gmail.com`,
        login,
        password,
    }
}

export const createBlog = async (userId: string, model: BlogCreationTestModel = validBlogData) : Promise<BlogViewModel> => {
    const result = await requestApp
        .post("/blogs")
        .set('Authorization', 'Basic ' + authBasic64)
        .set('Content-Type', 'application/json')
        .send(model)
    return result.body;
}

export const createPost = async (userId: string, blogId: string, model: PostCreationTestModel = validPostData) : Promise<PostViewModel> => {
    const result = await requestApp
        .post("/posts")
        .set('Authorization', 'Basic ' + authBasic64)
        .set('Content-Type', 'application/json')
        .send({
            ...model,
            blogId,
        } as PostsCreateModel);
    return result.body;
}

export const createUser = async (model: UserCreateRequestModel) : Promise<UserViewModel> => {
    const result = await requestApp
        .post("/users")
        .set('Authorization', 'Basic ' + authBasic64)
        .set('Content-Type', 'application/json')
        .send({
            ...model,
        } as UserCreateRequestModel);
    return result.body;
}

export const extractCookie = (res: Response, name: string) : Cookie | undefined =>  {
    const decodedCookies = setCookie.parse(res.headers["set-cookie"], {
        decodeValues: true  // default: true
    });
    return decodedCookies.find(cookie => cookie.name === name);
};

export const createCookie = (cookieObj: Object) : string =>  {
    return Object.entries(cookieObj).map(([name, value]) => {
        return name + "=" +value;
    }).join(";");
};

export const wait = async (s: number) : Promise<void> => {
    return new Promise<void>(res => {
        setTimeout(() => {
            res();
        }, s * 1000)
    })
}

export const createComment = async (postId: string, userId: string, model: CommentCreationTestModel = validCommentData) : Promise<CommentViewModel> => {
    const result = await requestApp
        .post(`/posts/${postId}/comments`)
        .set('Authorization', 'Bearer ' + createAccessToken(userId).token)
        .set('Content-Type', 'application/json')
        .send({
            ...model
        } as CommentCreateRequestModel);
    return result.body;
}