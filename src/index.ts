import {app} from './app'
import {connectDb} from "./db";
import {appConfig} from "./utils/config";

const {port} = appConfig;

app.listen(port, async () => {
    await connectDb();
    console.log(`App is running on port: ${port}`)
})