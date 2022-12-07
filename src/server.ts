import fetch from "node-fetch";
import * as config from "config";
import * as express from "express";
import { action, controller, expressRouter } from "@eight/eight-rest";
import { EightController } from "@eight/practices";
import { DummyLogger, Logger, Logging } from "@eight/logging";
import { ShareableController } from "./controllers/shareable_controller";
import { createEOYAvatarShareable } from "./lib/avatar_generator";
import { createEOYRecapShareable } from "./lib/recap_generator";

require("@eight/logging/enable-tracing");

@controller("")
class RootController extends EightController {
    @action("get")
    public async get() {
        return { api: "shareable-asset-api", version: "v1" };
    }
}

export function createExpressApp(logger: Logger = new DummyLogger()) {
    const router = express.Router();

    router.use(expressRouter(RootController, () => new RootController(logger)));
    router.use(expressRouter(ShareableController, () => new ShareableController(logger)));

    router.use(express.text());
    router.post("/shareable", async (req, res) => {
        let body;
        try {
            body = JSON.parse(req.body);
        } catch (e) {
            res.status(400);
            return;
        }

        if (!body) {
            res.status(400);
            return;
        }

        let resData = body.resData;

        if (!resData || !resData.Avatar) {
            resData = await fetch(`https://i.eight.sl/eoy-lifeboat?uid=${body.userData.userId}`).then((r: { json: () => any; }) => r.json());
        }

        try {
            const avatar = resData.Avatar || "Spacewalker";
            const sfs = resData["avg_sfs_score"] || 80;
            const highestSFS = resData["highest_sfs_score"] || 100;
            const lowestSFS = resData["lowest_sfs_score"] || 0;
            const num100s = resData["total_100_sfs_score"] || 10;
            const temps = resData["temp_settings_overall"] || [2, 4, 5];
            const highestDate = new Date(`${resData["lowest_sfs_score_date"]}T00:00:00`).toLocaleString("default", { month: "short", day: "numeric" });
            const lowestDate = new Date(`${resData["highest_sfs_score_date"]}T00:00:00`).toLocaleString("default", { month: "short", day: "numeric" });

            const type = req.query.type;
            let response: {};
            if (type === "avatar") {
                response = await createEOYAvatarShareable(avatar);
            } else {
                response = await createEOYRecapShareable(avatar, sfs, highestSFS, lowestSFS, num100s, highestDate, lowestDate, temps);
            }

            res.send(JSON.stringify(response));
        } catch (e) {
            res.status(400);
        }
    });

    const app = express();
    app.use("/v1", router);
    app.set("etag", false);
    return app;
}

export async function startApi(app: express.Express, logger: Logger = new DummyLogger()) {
    const port = config.get<number>("port");
    const server = app.listen(port);
    server.timeout = 1000;
    logger.info(`API started on port ${port}`);

    return server;
}

async function main() {
    const logger = Logging.get("server");

    const app = createExpressApp(logger);
    await startApi(app, logger);
}

if (require.main === module) {
    main().catch(e => {
        throw e;
    });
}