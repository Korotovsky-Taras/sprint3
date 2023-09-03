import {app} from './app'
import {connectMongooseDb} from "./db";
import {appConfig} from "./utils/config";

const {port} = appConfig;

app.listen(port, async () => {
    await connectMongooseDb();
    console.log(`App is running on port: ${port}`)
})