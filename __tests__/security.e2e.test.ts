import {
    Cookie,
    createCookie,
    createNewUserModel,
    createUser,
    extractCookie,
    refreshCookie,
    requestApp,
    SessionUnit,
    UserCreationTestModel,
} from "./utils";
import {Status, UserViewModel} from "../src/types";
import {createRefreshToken, verifyRefreshToken} from "../src/utils/tokenAdapter";
import {AuthRefreshTokenPayload} from "../src/types/login";
import {randomUUID, UUID} from "crypto";

let userModel1: UserCreationTestModel = createNewUserModel();
let userModel2: UserCreationTestModel = createNewUserModel();
let user1: UserViewModel | null = null;
let user2: UserViewModel | null = null;


let userAgents = ["app1", "app1", "app1", "app1"];
let user1Sessions: SessionUnit[] = [];
let user2Sessions: SessionUnit[] = [];

function removeUser1Session(sessionUuid: UUID) {
    user1Sessions = user1Sessions.filter(session => session.uuid != sessionUuid);
}

function getUser1Session(index: number) : SessionUnit {
    const session = user1Sessions[index];
    if (session === undefined) {
        throw Error("Session index error")
    }
    return session;
}


describe("security testing", () => {

    beforeAll(async () => {
        await requestApp.delete("/testing/all-data");
        user1 = await createUser(userModel1);
        user2 = await createUser(userModel2);
        user1Sessions.length = 0;
        user2Sessions.length = 0;
    })

    it("should login user on 4 devices", async () => {

        for (const userAgent of userAgents) {
            const res = await requestApp
                .post(`/auth/login`)
                .set('Content-Type', 'application/json')
                .set('User-Agent', userAgent)
                .send({
                    loginOrEmail: userModel1.login,
                    password: userModel1.password
                }).expect(Status.OK)

            expect(res.body).toEqual({
                accessToken: expect.any(String)
            })

            const cookie : Cookie | undefined = extractCookie(res, "refreshToken");
            if (cookie) {
                const payload : AuthRefreshTokenPayload | null = verifyRefreshToken(cookie.value);
                if (payload) {
                    user1Sessions.push({
                        uuid: randomUUID(),
                        payload,
                        refreshToken: cookie.value
                    });
                }
            }
        }

        expect(user1Sessions).toHaveLength(userAgents.length)

    })


    it("should return list of 4 devices", async () => {
        const session = getUser1Session(0);

        const res = await requestApp
            .get(`/security/devices`)
            .set("Cookie", [createCookie({
                refreshToken: session.refreshToken,
                Path: "/",
                HttpOnly: true,
                Secure: true
            })])
            .expect(Status.OK)

        expect(res.body).toHaveLength(4);

    })


    it("should update refreshToken 1 device", async () => {
        const session : SessionUnit = getUser1Session(0)

        const res = await requestApp
            .post(`/auth/refresh-token`)
            .set("Cookie", [createCookie({
                refreshToken: session.refreshToken,
                Path: "/",
                HttpOnly: true,
                Secure: true
            })])
            .expect(Status.OK)

        const cookie = extractCookie(res, "refreshToken");

        expect(cookie).not.toBeUndefined();
        expect(cookie!.value).not.toEqual(session.refreshToken);

        refreshCookie(cookie, session);

    })

    it("should return list of 4 devices too", async () => {
        const session : SessionUnit = getUser1Session(0)

        const res = await requestApp
            .get(`/security/devices`)
            .set("Cookie", [createCookie({
                refreshToken: session.refreshToken,
                Path: "/",
                HttpOnly: true,
                Secure: true
            })])
            .expect(Status.OK)

        expect(res.body).toHaveLength(4);

    })

    it("should delete 2cond device", async () => {

        const session0 = getUser1Session(0);
        const session1 = getUser1Session(1);

        await requestApp
            .delete(`/security/devices/${session1.payload.deviceId}`)
            .set("Cookie", [createCookie({
                refreshToken: session0.refreshToken,
                Path: "/",
                HttpOnly: true,
                Secure: true
            })])
            .expect(Status.NO_CONTENT);

        removeUser1Session(session1.uuid);

        const res = await requestApp
            .get(`/security/devices`)
            .set("Cookie", [createCookie({
                refreshToken: session0.refreshToken,
                Path: "/",
                HttpOnly: true,
                Secure: true
            })])
            .expect(Status.OK)

        expect(res.body).toHaveLength(3);

    })


    it("should logout device session", async () => {

        const session1 = getUser1Session(0);

        expect(session1).not.toBeUndefined()

        await requestApp
            .post(`/auth/logout`)
            .set("Cookie", [createCookie({
                refreshToken: session1.refreshToken,
                Path: "/",
                HttpOnly: true,
                Secure: true
            })])
            .expect(Status.NO_CONTENT);

        removeUser1Session(session1.uuid);

        const session2 = getUser1Session(0);

        const res = await requestApp
            .get(`/security/devices`)
            .set("Cookie", [createCookie({
                refreshToken: session2.refreshToken,
                Path: "/",
                HttpOnly: true,
                Secure: true
            })])
            .expect(Status.OK)

        expect(res.body).toHaveLength(2);

    })


    it("should remove all devices expect device 1", async () => {

        const session = getUser1Session(0);

        await requestApp
            .delete(`/security/devices`)
            .set("Cookie", [createCookie({
                refreshToken: session.refreshToken,
                Path: "/",
                HttpOnly: true,
                Secure: true
            })])
            .expect(Status.NO_CONTENT);

        user1Sessions.forEach(({uuid}) => {
            if (uuid != session.uuid) {
                removeUser1Session(uuid)
            }
        })

        const res = await requestApp
            .get(`/security/devices`)
            .set("Cookie", [createCookie({
                refreshToken: session.refreshToken,
                Path: "/",
                HttpOnly: true,
                Secure: true
            })])
            .expect(Status.OK)

        expect(res.body).toHaveLength(1);

    })

    it("should return 403 when user1 try logout user2", async () => {

        const user1Session = getUser1Session(0);

        const res = await requestApp
            .post(`/auth/login`)
            .set('Content-Type', 'application/json')
            .send({
                loginOrEmail: userModel2.login,
                password: userModel2.password
            }).expect(Status.OK)

        const cookie : Cookie | undefined = extractCookie(res, "refreshToken");

        if (!cookie) {
            throw Error();
        }

        const payload: AuthRefreshTokenPayload | null = verifyRefreshToken(cookie.value);
        if (!payload) {
            throw Error()
        }

        await requestApp
            .post(`/auth/logout`)
            .set("Cookie", [createCookie({
                refreshToken: createRefreshToken(payload.userId, user1Session.payload.deviceId),
                Path: "/",
                HttpOnly: true,
                Secure: true
            })])
            .expect(Status.UNATHORIZED);

    })


})