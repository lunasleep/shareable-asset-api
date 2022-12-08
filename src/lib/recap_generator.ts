
import { Canvas, CanvasGradient, CanvasPattern, CanvasRenderingContext2D, createCanvas, Image, loadImage, registerFont } from "canvas";
import { number } from "types-joi";

const W = 1080;
const H = 1920;

registerFont("assets/spaced.ttf", {family: "Spaced"});
registerFont("assets/bold.otf", {family: "AKG-Bold"});

const images: { cosmic: Image | undefined; deep: Image | undefined; spacewalker: Image | undefined; supernova: Image | undefined; stellar: Image | undefined; newmoon: Image | undefined; ice: Image | undefined; nobuzz: Image | undefined; galaxy: Image | undefined } = {
    cosmic: undefined,
    deep: undefined,
    galaxy: undefined,
    ice: undefined,
    newmoon: undefined,
    nobuzz: undefined,
    spacewalker: undefined,
    stellar: undefined,
    supernova: undefined
};

const initImages = async () => {
    images.cosmic = await loadImage("assets/recaps/cosmic.jpg");
    images.deep = await loadImage("assets/recaps/deep.jpg");
    images.galaxy = await loadImage("assets/recaps/galaxy.jpg");
    images.ice = await loadImage("assets/recaps/ice.jpg");
    images.newmoon = await loadImage("assets/recaps/new.jpg");
    images.nobuzz = await loadImage("assets/recaps/no.jpg");
    images.spacewalker = await loadImage("assets/recaps/spacewalker.jpg");
    images.stellar = await loadImage("assets/recaps/stellar.jpg");
    images.supernova = await loadImage("assets/recaps/supernova.jpg");
};

const getImage = (avatarName: string) => {
    switch (avatarName) {
        case "New Moon":
            return images.newmoon;
        case "Cosmic Star":
            return images.cosmic;
        case "Supernova":
            return images.supernova;
        case "Spacewalker":
            return images.spacewalker;
        case "Deep Space Dreamer":
            return images.deep;
        case "Ice Nebula":
            return images.ice;
        case "The Galaxy Great":
            return images.galaxy;
        case "Stellar Sleeper":
            return images.stellar;
        case "No Buzz Aldrin":
            return images.nobuzz;
    }

    return images.spacewalker;
};

const drawGradientText = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, px: number, text: string, center = false) => {
    ctx.save();
    const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
    gradient.addColorStop(0, "#338BC2");
    gradient.addColorStop(1, "#DFFEE6");

    ctx.font = `${px}px "Spaced"`;
    ctx.fillStyle = gradient;
    ctx.textAlign = center ? "center" : "left";
    ctx.fillText(text, x, y);
    ctx.restore();
};

const drawColorText = (ctx: CanvasRenderingContext2D, x: number, y: number, px: number, text: string, color: string, center = false) => {
    ctx.save();
    ctx.font = `${px}px "AKG-Bold"`;
    ctx.fillStyle = color;
    ctx.textAlign = center ? "center" : "left";
    ctx.fillText(text, x, y);
    ctx.restore();
};

const drawRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, fillStyle: string | CanvasGradient | CanvasPattern) => {
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.fillStyle = fillStyle;
    ctx.fill();
    ctx.restore();
};

const drawFunSquare = (ctx: CanvasRenderingContext2D, x: number, num: number, dim: number) => {
    ctx.save();
    ctx.beginPath();
    const w = dim;
    const h = dim;

    const top = 1263;
    const bottom = 1619;
    const _num = -1 * ( num - 10);

    const y = (top + (_num / 20) * (bottom - top)) - (h / 2);
    const _x = x - (w / 2);

    ctx.translate(_x + w / 2, y + h / 2 );
    ctx.rotate(45 * Math.PI / 180);
    ctx.rect(-w / 2, -h / 2, w, h);

    ctx.strokeStyle = "white";
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.restore();
};

const drawTempLine = (ctx: CanvasRenderingContext2D, lineNo: number, num1: number, num2: number) => {
    ctx.save();
    ctx.beginPath();

    const top = 1263;
    const bottom = 1619;

    const _num1 = -1 * ( num1 - 10);
    const _num2 = -1 * ( num2 - 10);

    const x1 = lineNo === 0 ? 157 : 277;
    const x2 = lineNo === 0 ? 277 : 396;

    const y1 = (top + (_num1 / 20) * (bottom - top));
    const y2 = (top + (_num2 / 20) * (bottom - top));

    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();
};

export const createEOYRecapShareable =  async (avatar: string, sfs: number, highestSFS: number, lowestSFS: number, num100s: number, highestDate: string, lowestDate: string, temps: number[]) => {
    const canvas = createCanvas(W, H);
    const ctx = canvas.getContext("2d");

    if (!images.cosmic) {
        await initImages();
    }

    ctx.drawImage(getImage(avatar), 0, 0, W, H);

    drawGradientText(ctx, 737, 880, (sfs === 100 ? 113 : 70), 70, 64, sfs.toString(), true);
    drawGradientText(ctx, 557, 1260, (highestSFS === 100 ? 167 : 113), 100, 92, highestSFS.toString());
    drawGradientText(ctx, 557, 1424, (lowestSFS === 100 ? 167 : 101), 100, 92, lowestSFS.toString());
    drawGradientText(ctx, 557, 1594, (num100s === 100 ? 167 : 101), 100, 92, num100s.toString());
    drawColorText(ctx, 809, 852, 24, "AVERAGE" , "white");
    drawColorText(ctx, 809, 878, 24, "SLEEP SCORE" , "white");
    drawRect(ctx, (highestSFS === 100 ? 762 : 714), 1196, (highestDate.length > 5 ? 139 : 112), 53, "#1A1A1A");
    drawRect(ctx, (lowestSFS === 100 ? 762 : 714), 1365, (lowestDate.length > 5 ? 139 : 112), 53, "#1A1A1A");
    drawColorText(ctx, (highestSFS === 100 ? 773 : 725), 1234, 36, highestDate, "#BABABA");
    drawColorText(ctx, (lowestSFS === 100 ? 773 : 725), 1405, 36, lowestDate, "#BABABA");

    drawColorText(ctx, 157, 1235, 24, formatTempNumber(temps[0]), getNumberColor(temps[0]), true);
    drawColorText(ctx, 277, 1235, 24, formatTempNumber(temps[1]), getNumberColor(temps[1]), true);
    drawColorText(ctx, 396, 1235, 24, formatTempNumber(temps[2]), getNumberColor(temps[2]), true);

    drawTempLine(ctx, 0, temps[0], temps[1]);
    drawTempLine(ctx, 1, temps[1], temps[2]);

    drawFunSquare(ctx, 157, temps[0], 24);
    drawFunSquare(ctx, 277, temps[1], 24);
    drawFunSquare(ctx, 396, temps[2], 24);
    drawFunSquare(ctx, 157, temps[0], 4);
    drawFunSquare(ctx, 277, temps[1], 4);
    drawFunSquare(ctx, 396, temps[2], 4);

    return {
        dataURL: canvas.toDataURL("image/jpeg"),
    };
};

export const formatTempNumber = (number: number) => {
    const clamped = Math.round(Math.max(-10, Math.min(10, number)));
    return clamped > 0 ? `+${clamped}` : clamped.toString();
};


const getNumberColor = (number: number) => {
    if (number <= -8) {
        return "#1862ff";
    }

    if (number <= -5) {
        return "#304bf6";
    }

    if (number <= -3) {
        return "#3744f3";
    }

    if (number < 0) {
        return "#4c39f2";
    }

    if (number === 0) {
        return "#832ef5";
    }

    if (number <= 2) {
        return "#b91332";
    }

    if (number <= 4) {
        return "#c31435";
    }

    if (number <= 7) {
        return "#d01639";
    }

    return "#e6183f";
};
