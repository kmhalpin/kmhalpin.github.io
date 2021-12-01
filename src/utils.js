import { Texture } from 'glsl-canvas-js/dist/cjs/glsl';

Texture.isTextureUrl = (text) => text && (/\.(jpg|jpeg|png|ogv|webm|mp4|bmp)$/i).test(text.split('?')[0]);

export default {};

const imageHandler = new Image();

export const resize = (canvas, image) => {
  imageHandler.onload = () => {
    const canvasWidth = Math.min(300 * (window.innerWidth / 360), 360);
    canvas.setAttribute('style', `width: ${canvasWidth}px; height: ${canvasWidth * (imageHandler.height / imageHandler.width)}px;`);
    // alert(`${canvasWidth} ${imageHandler.height} ${imageHandler.width}`);
  };
  imageHandler.src = image;
  // const deviceWidth = window.innerWidth / 480;

  // canvas.setAttribute('width', `${Math.min(400 * deviceWidth, 480)}px`);
  // canvas.setAttribute('height', `${Math.min(300 * deviceWidth, 360)}px`);
};
