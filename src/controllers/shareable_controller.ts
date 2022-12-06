import { action, BadRequest, body, controller, query } from "@eight/eight-rest";
import * as joi from "types-joi";
import { EightController } from "@eight/practices";
import { createShareable } from "../lib/generator";
import { createEOYAvatarShareable } from "../lib/avatar_generator";
import { createEOYRecapShareable } from "../lib/recap_generator";
import fetch from "node-fetch";



@controller("/shareable")
export class ShareableController extends EightController {
    @action("get")
    public async getShareable(
        @query("date", joi.date())
        date: Date,
        @query("score", joi.number())
        score: number,
        @query("temps", joi.string())
        temps: string) {
        const integer_temps = temps.split(",").map(a => parseInt(a));
        this.logger.info({date: date}, "creating shareable resource");

        let hasNaN = false;
        for (const temp of integer_temps) {
            if (isNaN(temp)) {
                hasNaN = true;
                break;
            }
        }

        if (!integer_temps.length || hasNaN) {
            this.logger.child({ date, score, temps }).warn("Bad temps string");
            throw new BadRequest("Malformed Temperature String");
        }

        return await createShareable(date, score, integer_temps);
    }

    @action("post")
    public async postDataShareable(
        @query("type", joi.string()) type: string,
        @body body: string) {

        return JSON.parse(body);

        if (!body || !body.userData) {
            throw new Error();
        }

        return body;

        let resData = body.resData;

        if (!resData) {
            resData = await fetch(`https://i.eight.sl/eoy-lifeboat?uid=${body.userData.userId}`).then((r: { json: () => any; }) => r.json());
        }

        const avatar = resData.avatar;




        if (type === "avatar") {
            return await createEOYAvatarShareable(avatar);
        } else {
            return await createEOYRecapShareable(avatar);
        }
    }
}
