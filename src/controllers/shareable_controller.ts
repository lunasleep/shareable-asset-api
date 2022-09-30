import { action, controller, query } from "@eight/eight-rest";
import * as joi from "types-joi";
import { EightController } from "@eight/practices";
import { createShareable } from "../lib/generator";


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
        const shearable = await createShareable(date, score, integer_temps);
        return shearable;
    }
}
