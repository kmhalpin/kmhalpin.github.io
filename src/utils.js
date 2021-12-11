import { Texture } from 'glsl-canvas-js/dist/cjs/glsl';

Texture.isTextureUrl = (text) => text && (/\.(jpg|jpeg|png|ogv|webm|mp4|bmp)$/i).test(text.split('?')[0]);

const imageHandler = new Image();

const getVideoSize = (url) => new Promise((res) => {
  const videoHandler = document.createElement('video');
  videoHandler.addEventListener('loadedmetadata', function loaded() {
    return res({ height: this.videoHeight, width: this.videoWidth });
  }, false);
  videoHandler.src = url;
});

export const resize = (canvas, image) => {
  const canvasWidth = Math.min(300 * (window.innerWidth / 360), 360);
  imageHandler.onload = () => {
    canvas.setAttribute('style', `width: ${canvasWidth}px; height: ${canvasWidth * (imageHandler.height / imageHandler.width)}px;`);
    // alert(`${canvasWidth} ${imageHandler.height} ${imageHandler.width}`);
  };
  imageHandler.src = image;
  getVideoSize(image).then((value) => canvas.setAttribute('style', `width: ${canvasWidth}px; height: ${canvasWidth * (value.height / value.width)}px;`));
  // const deviceWidth = window.innerWidth / 480;

  // canvas.setAttribute('width', `${Math.min(400 * deviceWidth, 480)}px`);
  // canvas.setAttribute('height', `${Math.min(300 * deviceWidth, 360)}px`);
};

export const images = [
  {
    url: '/sample/lena_gray.bmp',
    name: 'Lena',
  },
  {
    url: '/sample/barbara_gray.bmp',
    name: 'Barbara',
  },
  {
    url: '/sample/moon.mp4',
    name: 'Moon',
  },
  {
    url: '/sample/Chrysanthemum.jpg',
    name: 'Chrysanthemum',
  },
  {
    url: '/sample/Desert.jpg',
    name: 'Desert',
  },
  {
    url: '/sample/Hydrangeas.jpg',
    name: 'Hydrangeas',
  },
  {
    url: '/sample/Jellyfish.jpg',
    name: 'Jellyfish',
  },
  {
    url: '/sample/Koala.jpg',
    name: 'Koala',
  },
  {
    url: '/sample/Lighthouse.jpg',
    name: 'Lighthouse',
  },
  {
    url: '/sample/Penguins.jpg',
    name: 'Penguins',
  },
  {
    url: '/sample/Tulips.jpg',
    name: 'Tulips',
  },
];

export default { resize, images };
