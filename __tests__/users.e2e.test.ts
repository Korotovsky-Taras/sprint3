// TODO tests
import {requestApp} from "./utils";

describe("users testing", () => {

    beforeAll(async () => {
        await requestApp.delete("/testing/all-data");
    })

    it("should create user", async () => {

    })

})