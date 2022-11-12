import {runDb} from "./routes/db";
import {app} from "./app-config";
import {config} from "dotenv";
import path from "path";

config({ path: path.join(__dirname, '..', '.env') });

const port = process.env.PORT || 5002

const startApp = async () => {
    await runDb()
    app.listen(port,  () => {
        console.log(`Example app listening on port: ${port}`)
    })
}
startApp()
