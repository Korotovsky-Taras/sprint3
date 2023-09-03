import {createNewUserModel, createUser, requestApp, UserCreationTestModel, wait,} from "./utils";
import {Status, UserViewModel} from "../src/types";
import {connectDisconnectDb, connectMongooseDb} from "../src/db";

let userModel: UserCreationTestModel = createNewUserModel();
let user: UserViewModel | null = null;

let userAgents = ["app1", "app2", "app3", "app4", "app5"];

describe("security testing", () => {

    beforeAll(async () => {
        await connectMongooseDb();
        await requestApp.delete("/testing/all-data");
        user = await createUser(userModel);
    })

    afterAll(async () => {
        await connectDisconnectDb();
    });

    it("should not login by limiter", async () => {

        for (const userAgent of userAgents) {
            await requestApp
                .post(`/auth/login`)
                .set('Content-Type', 'application/json')
                .set('User-Agent', userAgent)
                .send({
                    loginOrEmail: userModel.login,
                    password: userModel.password
                }).expect(Status.OK)
        }

        await requestApp
            .post(`/auth/login`)
            .set('Content-Type', 'application/json')
            .set('User-Agent', userAgents[1])
            .send({
                loginOrEmail: userModel.login,
                password: userModel.password
            }).expect(Status.TO_MANY_REQUESTS)

    })

    it("should login by limiter", async () => {

        await wait(10);

        for (const userAgent of userAgents) {
            await requestApp
                .post(`/auth/login`)
                .set('Content-Type', 'application/json')
                .set('User-Agent', userAgent)
                .send({
                    loginOrEmail: userModel.login,
                    password: userModel.password
                }).expect(Status.OK)
        }

        await wait(10);

        await requestApp
            .post(`/auth/login`)
            .set('Content-Type', 'application/json')
            .set('User-Agent', userAgents[1])
            .send({
                loginOrEmail: userModel.login,
                password: userModel.password
            }).expect(Status.OK)

    })


})