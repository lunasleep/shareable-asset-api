
import { Canvas, CanvasRenderingContext2D, createCanvas, Image, loadImage, registerFont } from "canvas";

const W = 1080;
const H = 1920;

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
            return images.supernova;
        case "Deep Space Dreamer":
            return images.supernova;
        case "Ice Nebula":
            return images.supernova;
        case "The Galaxy Great":
            return images.supernova;
        case "Stellar Sleeper":
            return images.supernova;
    }

    return images.spacewalker;
};

export const createEOYRecapShareable =  async (data: any) => {
    const canvas = createCanvas(W, H);
    const ctx = canvas.getContext("2d");

    if (!images.cosmic) {
        await initImages();
    }

    ctx.drawImage(getImage(data.avatar), 0, 0, W, H);

    return {
        dataURL: canvas.toDataURL("image/jpeg"),
    };
};