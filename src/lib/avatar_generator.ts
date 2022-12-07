import { createCanvas, Image, loadImage } from "canvas";

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
    images.cosmic = await loadImage("assets/avatars/cosmic.jpg");
    images.deep = await loadImage("assets/avatars/deep.jpg");
    images.galaxy = await loadImage("assets/avatars/galaxy.jpg");
    images.ice = await loadImage("assets/avatars/ice.jpg");
    images.newmoon = await loadImage("assets/avatars/new.jpg");
    images.nobuzz = await loadImage("assets/avatars/no.jpg");
    images.spacewalker = await loadImage("assets/avatars/spacewalker.jpg");
    images.stellar = await loadImage("assets/avatars/stellar.jpg");
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


export const createEOYAvatarShareable =  async (avatar: string) => {
    const canvas = createCanvas(W, H);
    const ctx = canvas.getContext("2d");

    if (!images.cosmic) {
        await initImages();
    }

    ctx.drawImage(getImage(avatar), 0, 0, W, H);

    return {
        dataURL: canvas.toDataURL("image/jpeg"),
    };
};