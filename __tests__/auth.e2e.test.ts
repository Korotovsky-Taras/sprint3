import {createCookie, createNewUserModel, createUser, extractCookie, requestApp, UserCreationTestModel,} from "./utils";
import {Status, UserViewModel} from "../src/types";
import {Response} from "supertest";

let userModel: UserCreationTestModel = createNewUserModel();
let user: UserViewModel | null = null;
let refreshToken: string | null = null;

describe("auth testing", () => {

    beforeAll(async () => {
        await requestApp.delete("/testing/all-data");
        user = await createUser(userModel);
        refreshToken = null;
    })

    it("should return accessToken ", async () => {

        const res: Response = await requestApp
            .post(`/auth/login`)
            .set('Content-Type', 'application/json')
            .send({
                loginOrEmail: userModel.login,
                password: userModel.password
            })
            .expect(Status.OK);

        expect(res.body).toEqual({
            accessToken: expect.any(String)
        })

        const cookie = extractCookie(res, "refreshToken");

        expect(cookie).not.toBeUndefined();
        refreshToken = cookie!.value;
    })

    it("should refresh tokens", async () => {

        expect(refreshToken).not.toBeNull();

        const res: Response = await requestApp
            .post(`/auth/refresh-token`)
            .set('Content-Type', 'application/json')
            .set("Cookie", [createCookie({
                refreshToken,
                Path: "/",
                HttpOnly: true,
                Secure: true
            })])
            .send({})
            .expect(Status.OK);

        const cookie = extractCookie(res, "refreshToken");

        expect(cookie).not.toBeUndefined();
        expect(cookie!.value).not.toEqual(refreshToken);
        refreshToken = cookie!.value;

    })

    it("should logout 204", async () => {

        expect(refreshToken).not.toBeNull();

        const res: Response = await requestApp
            .post(`/auth/logout`)
            .set('Content-Type', 'application/json')
            .set("Cookie", [createCookie({
                refreshToken,
                Path: "/",
                HttpOnly: true,
                Secure: true
            })])
            .send({})
            .expect(Status.NO_CONTENT);

        const cookie = extractCookie(res, "refreshToken");

        expect(cookie).not.toBeUndefined();
        expect(cookie!.value).not.toEqual(refreshToken);

    })


    it("should return error if passed wrong login or password; status 401;", async () => {

        await requestApp
            .post(`/auth/login`)
            .set('Content-Type', 'application/json')
            .send({
                loginOrEmail: userModel.login,
                password: "wrong password"
            })
            .expect(Status.UNATHORIZED);


    })


})