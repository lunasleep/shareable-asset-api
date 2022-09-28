import * as config from "config";
import * as express from "express";
import { eightExpress, Logging, EightController } from "@eight/practices";
import { ExpressRouter, ControllerMetadata, action, Router, Controller } from "@eight/eight-rest";

const logger = Logging.get("server");

class Root extends EightController {
    @action("get")
    public async default() {
        return { apiName: config.get("logging.name") };
    }
}

function registerController(router: Router, controller: Function, factory: () => Controller) {
    const metadata = ControllerMetadata.fromController(controller);
    metadata.register(router, factory);
}

async function start() {
    const router = express.Router();

    const expressRouter = new ExpressRouter(router);
    registerController(expressRouter, Root, () => new Root());

    const app = eightExpress((app) => {
        app.use("/v1", router);
    });

    const port = config.get<number>("http.port");
    const server = app.listen(port);
    server.timeout = config.get<number>("http.timeout");
    logger.info(`API started on port ${port}`);

    return server;
}

if (require.main === module)
    start();
