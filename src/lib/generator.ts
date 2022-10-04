import { CanvasRenderingContext2D, createCanvas, Image, loadImage, registerFont } from "canvas";

registerFont("assets/bold.otf", {family: "AKG-Bold"});
registerFont("assets/regular.otf", {family: "AKG-Regular"});

const SCALE = 1;
const BASE_WIDTH = 1080;
const BASE_HEIGHT = 1080;
const TEXT_NUDGE = 5;

const W = BASE_WIDTH * SCALE;
const H = BASE_HEIGHT * SCALE;

const ARC_START = -Math.PI / 2;
const CIRCLE = 2 * Math.PI;
const CIRCLE_Y_NUDGE = -28 * SCALE;
const CIRCLE_RADIUS = 229 * SCALE;
const CIRCLE_STROKE_WIDTH = 21 * SCALE;
const CIRCLE_BLUR_AMOUNT = 35 * SCALE;

function drawProgress(ctx: CanvasRenderingContext2D, score: number) {
    ctx.save();
    ctx.shadowColor = "#246AFF";
    ctx.shadowBlur = CIRCLE_BLUR_AMOUNT;

    ctx.fillStyle = "#122668";

    ctx.beginPath();
    ctx.arc(W / 2, H / 2 + CIRCLE_Y_NUDGE, CIRCLE_RADIUS, ARC_START, ARC_START + CIRCLE, false);
    ctx.fill();
    ctx.strokeStyle = "#246AFF";
    ctx.lineWidth = CIRCLE_STROKE_WIDTH;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(W / 2, H / 2 + CIRCLE_Y_NUDGE, CIRCLE_RADIUS, ARC_START, ARC_START + ((score / 100) * CIRCLE), false);
    ctx.stroke();
    ctx.restore();
}

function drawText(ctx: CanvasRenderingContext2D, date: Date, score: number) {
    ctx.save();
    ctx.textAlign = "start";
    ctx.textBaseline = "top";

    ctx.font = `${48 * SCALE}px "AKG-Bold"`;
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Sleep Fitness Snapshot", 54 * SCALE, (54 + TEXT_NUDGE) * SCALE);

    ctx.font = `${36 * SCALE}px "AKG-Regular"`;
    ctx.fillStyle = "#adb3c5";
    ctx.fillText(date.toLocaleDateString(undefined, {weekday: "long", month: "long", day: "numeric"}), 54 * SCALE, (119 + TEXT_NUDGE) * SCALE);

    ctx.font = `${29 * SCALE}px "AKG-Bold"`;
    ctx.textAlign = "center";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Sleep Fitness", W / 2, (H / 2) + 41 * SCALE);

    // Nudge these differently is the percentage is 1 digit, 2, or 3 digits
    const stringScore = Math.round(score).toString();
    const numDigits = stringScore.length;
    ctx.font = `${134 * SCALE}px "AKG-Bold"`;
    ctx.fillStyle = "#ffffff";
    ctx.fillText(stringScore, W / 2 - 10 * SCALE, (H / 2) - 102 * SCALE);

    ctx.font = `${40 * SCALE}px "AKG-Regular"`;
    ctx.fillStyle = "#ffffff";
    ctx.fillText("%", W / 2 + (40 * numDigits + 10) * SCALE, (H / 2) - 35 * SCALE);

    ctx.font = `${30 * SCALE}px "AKG-Regular"`;
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Temperature Schedule", W / 2, H - 79 * SCALE);
    ctx.restore();
}

function drawLogo(ctx: CanvasRenderingContext2D, logo: Image) {
    ctx.drawImage(logo, W - 102 * SCALE, 52 * SCALE, 54 * SCALE, 71 * SCALE);
}

const temperatures = [
    "#1862FF", // -10
    "#1862FF", // -09
    "#1862FF", // -08
    "#1862FF", // -07
    "#304BF6", // -06
    "#304BF6", // -05
    "#3744F3", // -04
    "#3744F3", // -03
    "#4C39F2", // -02
    "#4C39F2", // -01
    "#832EF5", // +00
    "#B91332", // +01
    "#B91332", // +02
    "#C31435", // +03
    "#C31435", // +04
    "#D01639", // +05
    "#D01639", // +06
    "#E6183F", // +07
    "#E6183F", // +08
    "#E6183F", // +09
    "#E6183F", // +10
];

function drawTempGraph(ctx: CanvasRenderingContext2D, temps: number[]) {
    const percentageArea = 1.2;
    const playArea = W * percentageArea;
    const padding = (W - playArea) / 2;
    const endX = W - padding;
    const startX = padding;

    ctx.strokeStyle = "#246AFF";
    ctx.lineWidth = 4 * SCALE;
    ctx.font = `${40 * SCALE}px "AKG-Regular"`;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillStyle = "#ffffff";

    const points = [];

    for (let i = 0; i < temps.length; i++) {
        const temp = clamp(temps[i], -10, 10);
        const NUDGE = 2 * temp * SCALE;
        const x = ((i + 1) / (temps.length + 1)) * (endX - startX) + padding;
        const y = 840 * SCALE - NUDGE;
        points.push({
            x, y, temp
        });
    }

    points.unshift({x: 0, y: points[0].y, temp: points[0].temp});
    points.push({x: W, y: points[points.length - 1].y, temp: points[points.length - 1].temp});


    for (let i = 1; i < points.length; i++) {
        const a = points[i - 1];
        const b = points[i];

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.bezierCurveTo(
            a.x + (b.x - a.x) / 2,
            a.y,
            a.x + (b.x - a.x) / 2,
            b.y,
            b.x,
            b.y);
        const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
        grad.addColorStop(0, temperatures[a.temp + 10]);
        grad.addColorStop(1, temperatures[b.temp + 10]);
        ctx.strokeStyle = grad;
        ctx.stroke();
    }


    ctx.fillStyle = "#000";
    for (let i = 1; i < points.length - 1; i++) {
        ctx.beginPath();
        ctx.arc(points[i].x, points[i].y, 12, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = temperatures[points[i].temp + 10];
        ctx.stroke();
    }


    ctx.beginPath();
    ctx.moveTo(0, H);
    ctx.lineTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        const a = points[i - 1];
        const b = points[i];
        ctx.bezierCurveTo(
            a.x + (b.x - a.x) / 2,
            a.y,
            a.x + (b.x - a.x) / 2,
            b.y,
            b.x,
            b.y);
    }
    ctx.lineTo(W, H);
    const grad = ctx.createLinearGradient(W / 2, 820 * SCALE, W / 2, H);
    grad.addColorStop(0.23, "rgba(146, 38, 190, 0.25)");
    grad.addColorStop(0.55, "rgba(81, 56, 244, 0.25)");
    grad.addColorStop(0.88, "rgba(14, 32, 214, 0)");
    ctx.fillStyle = grad;
    ctx.fill();

    for (let i = 1; i < points.length - 1; i++) {
        const temp = points[i].temp;
        ctx.fillStyle = temperatures[temp + 10];
        ctx.fillText((temp <= 0 ? "" : "+") + temp, points[i].x, 925 * SCALE);
    }
}

export const createShareable = async (date: Date, score: number, temps: number[]) => {
    const canvas = createCanvas(W, H);
    const ctx = canvas.getContext("2d");

    const bg = await loadImage("assets/bgasset.jpg");
    const logo = await loadImage("assets/8.png");

    ctx.drawImage(bg, 0, 0, W, H);

    drawProgress(ctx, clamp(score, 0, 100));
    drawText(ctx, date, clamp(score, 0, 100));
    drawLogo(ctx, logo);
    drawTempGraph(ctx, temps);

    // const data = image.replace(/^data:image\/\w+;base64,/, "");
    // const buf = Buffer.from(data, "base64");
    // fs.writeFile("image.jpeg", buf, () => {
    // });

    return {
        dataURL: canvas.toDataURL("image/jpeg")
    };
};

const clamp = (number: number, min: number, max: number) => Math.max(min, Math.min(number, max));