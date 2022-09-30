require("@eight/logging/enable-tracing");
import * as config from "config";
import * as express from "express";
import { action, controller, expressRouter } from "@eight/eight-rest";
import { EightController } from "@eight/practices";
import { DummyLogger, Logger, Logging } from "@eight/logging";
import { createShareable } from "./lib/generator";

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

    const app = express();
    app.use("/v1", router);
    app.get("/v1/shareable/", async (req, res) => {
        const date = req.query.date as string;
        const score = req.query.score as string;
        const temps = req.query.temps as string;

        const _date = new Date(date);
        const _score = parseInt(score);
        const _temps = temps.split(",").map(a => parseInt(a));

        let hasNaN = false;
        for (const temp of _temps) {
            if (isNaN(temp)) {
                hasNaN = true;
                break;
            }
        }

        if (_date.toString() === "Invalid Date" || isNaN(_score) || !_temps.length || hasNaN) {
            res.writeHead(
                500,
                {
                    "Content-Type": "html/text",
                }
            );
            res.end();
            return;
        }

        const shareable = await createShareable(_date, _score, _temps);

        res.send(shareable);

    });
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