// TODO tests
import {requestApp} from "./utils";
import {connectDisconnectDb, connectMongooseDb} from "../src/db";

describe("users testing", () => {

    beforeAll(async () => {
        await connectMongooseDb();
        await requestApp.delete("/testing/all-data");
    })

    afterAll(async () => {
        await connectDisconnectDb();
    });


    it("should create user", async () => {

    })

})