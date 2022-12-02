
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
    images.cosmic = await loadImage("assets/avatars/cosmic_star.jpg");
    images.deep = await loadImage("assets/avatars/deep_dreamer.jpg");
    images.galaxy = await loadImage("assets/avatars/galaxy_great.jpg");
    images.ice = await loadImage("assets/avatars/ice_nebula.jpg");
    images.newmoon = await loadImage("assets/avatars/new_moon.jpg");
    images.nobuzz = await loadImage("assets/avatars/no_buzz_aldrin.jpg");
    images.spacewalker = await loadImage("assets/avatars/spacewalker.jpg");
    images.stellar = await loadImage("assets/avatars/stellar_sleeper.jpg");
    images.supernova = await loadImage("assets/avatars/supernova.jpg");
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