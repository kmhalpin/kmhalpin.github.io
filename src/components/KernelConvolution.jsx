import React, { createRef, useEffect, useState } from 'react';
import { Canvas } from 'glsl-canvas-js/dist/cjs/glsl';
import {
  Typography,
  FormControlLabel,
  FormControl,
  Checkbox,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Input,
  Slider,
} from '@material-ui/core';
import { resize, images } from '../utils';

const vertex = `
attribute vec2 a_position;
attribute vec2 a_texcoord;
attribute vec2 a_normal;
attribute vec2 a_color;

varying vec2 v_texcoord;
varying vec2 v_normal;
varying vec2 v_color;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);

  v_texcoord = a_texcoord;
  v_normal = a_normal;
  v_color = a_color;
}
`;

const fragment = `
precision lowp float;

uniform sampler2D u_img;
uniform vec2 u_resolution;
uniform float u_kernel[9];
uniform float u_kernelWeight;
uniform float u_slider;

uniform bool u_doGray;

varying vec2 v_texcoord;

vec4 getPixel(sampler2D img, vec2 pixel) {
  if(u_doGray) {
    return vec4(vec3(dot(texture2D(img, pixel).rgb, vec3(1.0/3.0))), 1.0);
  } else {
    return texture2D(img, pixel);
  }
}

void main() {
  vec2 canvasPixel = vec2(1.0) / u_resolution;

  if (v_texcoord.x >= u_slider / u_resolution.x) {
    vec4 convolution =
      getPixel(u_img, v_texcoord + canvasPixel * vec2(-1, -1)) * u_kernel[0] +
      getPixel(u_img, v_texcoord + canvasPixel * vec2( 0, -1)) * u_kernel[1] +
      getPixel(u_img, v_texcoord + canvasPixel * vec2( 1, -1)) * u_kernel[2] +
      getPixel(u_img, v_texcoord + canvasPixel * vec2(-1,  0)) * u_kernel[3] +
      getPixel(u_img, v_texcoord + canvasPixel * vec2( 0,  0)) * u_kernel[4] +
      getPixel(u_img, v_texcoord + canvasPixel * vec2( 1,  0)) * u_kernel[5] +
      getPixel(u_img, v_texcoord + canvasPixel * vec2(-1,  1)) * u_kernel[6] +
      getPixel(u_img, v_texcoord + canvasPixel * vec2( 0,  1)) * u_kernel[7] +
      getPixel(u_img, v_texcoord + canvasPixel * vec2( 1,  1)) * u_kernel[8] ;

    gl_FragColor = vec4((convolution / u_kernelWeight).rgb, 1);
  } else {
    gl_FragColor = vec4(texture2D(u_img, v_texcoord));
  }
}
`;

const kernels = {
  normal: [
    0, 0, 0,
    0, 1, 0,
    0, 0, 0,
  ],
  gaussianBlur: [
    0.045, 0.122, 0.045,
    0.122, 0.332, 0.122,
    0.045, 0.122, 0.045,
  ],
  gaussianBlur2: [
    1, 2, 1,
    2, 4, 2,
    1, 2, 1,
  ],
  gaussianBlur3: [
    0, 1, 0,
    1, 1, 1,
    0, 1, 0,
  ],
  unsharpen: [
    -1, -1, -1,
    -1, 9, -1,
    -1, -1, -1,
  ],
  sharpness: [
    0, -1, 0,
    -1, 5, -1,
    0, -1, 0,
  ],
  sharpen: [
    -1, -1, -1,
    -1, 16, -1,
    -1, -1, -1,
  ],
  edgeDetect: [
    -0.125, -0.125, -0.125,
    -0.125, 1, -0.125,
    -0.125, -0.125, -0.125,
  ],
  edgeDetect2: [
    -1, -1, -1,
    -1, 8, -1,
    -1, -1, -1,
  ],
  edgeDetect3: [
    -5, 0, 0,
    0, 0, 0,
    0, 0, 5,
  ],
  edgeDetect4: [
    -1, -1, -1,
    0, 0, 0,
    1, 1, 1,
  ],
  edgeDetect5: [
    -1, -1, -1,
    2, 2, 2,
    -1, -1, -1,
  ],
  edgeDetect6: [
    -5, -5, -5,
    -5, 39, -5,
    -5, -5, -5,
  ],
  sobelHorizontal: [
    1, 2, 1,
    0, 0, 0,
    -1, -2, -1,
  ],
  sobelVertical: [
    1, 0, -1,
    2, 0, -2,
    1, 0, -1,
  ],
  previtHorizontal: [
    1, 1, 1,
    0, 0, 0,
    -1, -1, -1,
  ],
  previtVertical: [
    1, 0, -1,
    1, 0, -1,
    1, 0, -1,
  ],
  boxBlur: [
    0.111, 0.111, 0.111,
    0.111, 0.111, 0.111,
    0.111, 0.111, 0.111,
  ],
  triangleBlur: [
    0.0625, 0.125, 0.0625,
    0.125, 0.25, 0.125,
    0.0625, 0.125, 0.0625,
  ],
  emboss: [
    -2, -1, 0,
    -1, 1, 1,
    0, 1, 2,
  ],
};

const CanvasRef = createRef();

function KernelConvolution() {
  const [canvas, setCanvas] = useState(null);
  const [image, setImage] = useState(images[0].url);
  const [kernel, setKernel] = useState('normal');
  const [customKernel, setCustomKernel] = useState({
    c_kernel_0: kernels.normal[0],
    c_kernel_1: kernels.normal[1],
    c_kernel_2: kernels.normal[2],
    c_kernel_3: kernels.normal[3],
    c_kernel_4: kernels.normal[4],
    c_kernel_5: kernels.normal[5],
    c_kernel_6: kernels.normal[6],
    c_kernel_7: kernels.normal[7],
    c_kernel_8: kernels.normal[8],
  });
  const [uniform, setUniform] = useState({
    u_slider: 0,
    u_doGray: true,
    'u_kernel[0]': kernels.normal[0],
    'u_kernel[1]': kernels.normal[1],
    'u_kernel[2]': kernels.normal[2],
    'u_kernel[3]': kernels.normal[3],
    'u_kernel[4]': kernels.normal[4],
    'u_kernel[5]': kernels.normal[5],
    'u_kernel[6]': kernels.normal[6],
    'u_kernel[7]': kernels.normal[7],
    'u_kernel[8]': kernels.normal[8],
  });
  const [kernelWeight, setKernelWeight] = useState(
    kernels.normal[0] + kernels.normal[1] + kernels.normal[2]
    + kernels.normal[3] + kernels.normal[4] + kernels.normal[5]
    + kernels.normal[6] + kernels.normal[7] + kernels.normal[8],
  );

  if (canvas instanceof Canvas) {
    canvas.loadTexture('u_img', image);
    canvas.setUniforms({
      ...uniform,
      u_kernelWeight: kernelWeight <= 0 ? 1 : kernelWeight,
    });
    resize(CanvasRef.current, image);
  }

  useEffect(() => {
    if (kernel === 'custom') {
      setUniform({
        ...uniform,
        'u_kernel[0]': !Number.isNaN(+customKernel.c_kernel_0) ? +customKernel.c_kernel_0 : uniform['u_kernel[0]'],
        'u_kernel[1]': !Number.isNaN(+customKernel.c_kernel_1) ? +customKernel.c_kernel_1 : uniform['u_kernel[1]'],
        'u_kernel[2]': !Number.isNaN(+customKernel.c_kernel_2) ? +customKernel.c_kernel_2 : uniform['u_kernel[2]'],
        'u_kernel[3]': !Number.isNaN(+customKernel.c_kernel_3) ? +customKernel.c_kernel_3 : uniform['u_kernel[3]'],
        'u_kernel[4]': !Number.isNaN(+customKernel.c_kernel_4) ? +customKernel.c_kernel_4 : uniform['u_kernel[4]'],
        'u_kernel[5]': !Number.isNaN(+customKernel.c_kernel_5) ? +customKernel.c_kernel_5 : uniform['u_kernel[5]'],
        'u_kernel[6]': !Number.isNaN(+customKernel.c_kernel_6) ? +customKernel.c_kernel_6 : uniform['u_kernel[6]'],
        'u_kernel[7]': !Number.isNaN(+customKernel.c_kernel_7) ? +customKernel.c_kernel_7 : uniform['u_kernel[7]'],
        'u_kernel[8]': !Number.isNaN(+customKernel.c_kernel_8) ? +customKernel.c_kernel_8 : uniform['u_kernel[8]'],
      });
      return;
    }
    const definedKernel = kernels[kernel];
    setUniform({
      ...uniform,
      'u_kernel[0]': definedKernel[0],
      'u_kernel[1]': definedKernel[1],
      'u_kernel[2]': definedKernel[2],
      'u_kernel[3]': definedKernel[3],
      'u_kernel[4]': definedKernel[4],
      'u_kernel[5]': definedKernel[5],
      'u_kernel[6]': definedKernel[6],
      'u_kernel[7]': definedKernel[7],
      'u_kernel[8]': definedKernel[8],
    });
    setCustomKernel({
      ...customKernel,
      c_kernel_0: definedKernel[0],
      c_kernel_1: definedKernel[1],
      c_kernel_2: definedKernel[2],
      c_kernel_3: definedKernel[3],
      c_kernel_4: definedKernel[4],
      c_kernel_5: definedKernel[5],
      c_kernel_6: definedKernel[6],
      c_kernel_7: definedKernel[7],
      c_kernel_8: definedKernel[8],
    });
  }, [kernel]);

  useEffect(() => setKernelWeight(
    uniform['u_kernel[0]'] + uniform['u_kernel[1]'] + uniform['u_kernel[2]']
    + uniform['u_kernel[3]'] + uniform['u_kernel[4]'] + uniform['u_kernel[5]']
    + uniform['u_kernel[6]'] + uniform['u_kernel[7]'] + uniform['u_kernel[8]'],
  ), [uniform]);

  useEffect(() => {
    setCanvas(new Canvas(CanvasRef.current, {
      vertexString: vertex,
      fragmentString: fragment,
    }));

    const handleResize = () => resize(CanvasRef.current, image);
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (canvas instanceof Canvas) canvas.destroy();
    };
  }, []);

  return (
    <Grid container justifyContent="center" alignItems="center" spacing={2}>
      <Grid item>
        <div style={{ width: '100%', height: '100%' }}>
          <canvas
            ref={CanvasRef}
          />
        </div>
        <Slider
          color="secondary"
          value={uniform.u_slider}
          valueLabelDisplay="auto"
          step={5}
          min={0}
          max={CanvasRef.current?.width || 0}
          onChange={(e, newValue) => (newValue >= 0) && setUniform({
            ...uniform,
            u_slider: newValue,
          })}
        />
      </Grid>
      <Grid item xs={10} sm={10} md={10} lg={6} xl={4}>
        <Grid container justifyContent="center" alignItems="center" spacing={2}>
          <Grid item xs={8}>
            <FormControl
              variant="outlined"
              style={{ width: '100%' }}
            >
              <InputLabel id="demo-simple-select-outlined-label">Pilih gambar</InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                label="Pilih gambar"
              >
                {images.map((v, idx) => (
                  <MenuItem key={idx} value={v.url}>
                    <img src={v.url} alt={v.name} height={25} />
                    {' '}
                    {v.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={(
                <Checkbox
                  checked={uniform.u_doGray}
                  onChange={(e) => setUniform({
                    ...uniform,
                    u_doGray: e.target.checked,
                  })}
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                />
)}
              label="Hitam putih"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl
              variant="outlined"
              style={{ width: '100%' }}
            >
              <InputLabel id="demo-simple-select-outlined-label">Pilih kernel tersedia</InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={kernel}
                onChange={(e) => setKernel(e.target.value)}
                label="Pilih kernel tersedia"
              >
                <MenuItem key="custom" value="custom">
                  Custom
                </MenuItem>
                {Object.keys(kernels).map((key, idx) => (
                  <MenuItem key={idx} value={key}>
                    {key}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid container item justifyContent="center" alignItems="center" spacing={1} xs={12}>
            <Grid item xs={12}>
              <Typography gutterBottom>Kernel Value</Typography>
            </Grid>
            <Grid item xs={4}>
              <FormControl
                variant="outlined"
                style={{ width: '100%' }}
              >
                <InputLabel htmlFor="kernel-0">Index 0</InputLabel>
                <Input
                  id="kernel-0"
                  type="text"
                  value={customKernel.c_kernel_0}
                  onChange={(e) => {
                    setCustomKernel({
                      ...customKernel,
                      c_kernel_0: e.target.value,
                    });
                    setKernel('custom');
                    if (Number.isNaN(+e.target.value)) return;
                    setUniform({
                      ...uniform,
                      'u_kernel[0]': +e.target.value,
                    });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl
                variant="outlined"
                style={{ width: '100%' }}
              >
                <InputLabel htmlFor="kernel-1">Index 1</InputLabel>
                <Input
                  id="kernel-1"
                  type="text"
                  value={customKernel.c_kernel_1}
                  onChange={(e) => {
                    setCustomKernel({
                      ...customKernel,
                      c_kernel_1: e.target.value,
                    });
                    setKernel('custom');
                    if (Number.isNaN(+e.target.value)) return;
                    setUniform({
                      ...uniform,
                      'u_kernel[1]': +e.target.value,
                    });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl
                variant="outlined"
                style={{ width: '100%' }}
              >
                <InputLabel htmlFor="kernel-2">Index 2</InputLabel>
                <Input
                  id="kernel-2"
                  type="text"
                  value={customKernel.c_kernel_2}
                  onChange={(e) => {
                    setCustomKernel({
                      ...customKernel,
                      c_kernel_2: e.target.value,
                    });
                    setKernel('custom');
                    if (Number.isNaN(+e.target.value)) return;
                    setUniform({
                      ...uniform,
                      'u_kernel[2]': +e.target.value,
                    });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl
                variant="outlined"
                style={{ width: '100%' }}
              >
                <InputLabel htmlFor="kernel-3">Index 3</InputLabel>
                <Input
                  id="kernel-3"
                  type="text"
                  value={customKernel.c_kernel_3}
                  onChange={(e) => {
                    setCustomKernel({
                      ...customKernel,
                      c_kernel_3: e.target.value,
                    });
                    setKernel('custom');
                    if (Number.isNaN(+e.target.value)) return;
                    setUniform({
                      ...uniform,
                      'u_kernel[3]': +e.target.value,
                    });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl
                variant="outlined"
                style={{ width: '100%' }}
              >
                <InputLabel htmlFor="kernel-4">Index 4</InputLabel>
                <Input
                  id="kernel-4"
                  type="text"
                  value={customKernel.c_kernel_4}
                  onChange={(e) => {
                    setCustomKernel({
                      ...customKernel,
                      c_kernel_4: e.target.value,
                    });
                    setKernel('custom');
                    if (Number.isNaN(+e.target.value)) return;
                    setUniform({
                      ...uniform,
                      'u_kernel[4]': +e.target.value,
                    });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl
                variant="outlined"
                style={{ width: '100%' }}
              >
                <InputLabel htmlFor="kernel-5">Index 5</InputLabel>
                <Input
                  id="kernel-5"
                  type="text"
                  value={customKernel.c_kernel_5}
                  onChange={(e) => {
                    setCustomKernel({
                      ...customKernel,
                      c_kernel_5: e.target.value,
                    });
                    setKernel('custom');
                    if (Number.isNaN(+e.target.value)) return;
                    setUniform({
                      ...uniform,
                      'u_kernel[5]': +e.target.value,
                    });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl
                variant="outlined"
                style={{ width: '100%' }}
              >
                <InputLabel htmlFor="kernel-6">Index 6</InputLabel>
                <Input
                  id="kernel-6"
                  type="text"
                  value={customKernel.c_kernel_6}
                  onChange={(e) => {
                    setCustomKernel({
                      ...customKernel,
                      c_kernel_6: e.target.value,
                    });
                    setKernel('custom');
                    if (Number.isNaN(+e.target.value)) return;
                    setUniform({
                      ...uniform,
                      'u_kernel[6]': +e.target.value,
                    });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl
                variant="outlined"
                style={{ width: '100%' }}
              >
                <InputLabel htmlFor="kernel-7">Index 7</InputLabel>
                <Input
                  id="kernel-7"
                  type="text"
                  value={customKernel.c_kernel_7}
                  onChange={(e) => {
                    setCustomKernel({
                      ...customKernel,
                      c_kernel_7: e.target.value,
                    });
                    setKernel('custom');
                    if (Number.isNaN(+e.target.value)) return;
                    setUniform({
                      ...uniform,
                      'u_kernel[7]': +e.target.value,
                    });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl
                variant="outlined"
                style={{ width: '100%' }}
              >
                <InputLabel htmlFor="kernel-8">Index 8</InputLabel>
                <Input
                  id="kernel-8"
                  type="text"
                  value={customKernel.c_kernel_8}
                  onChange={(e) => {
                    setCustomKernel({
                      ...customKernel,
                      c_kernel_8: e.target.value,
                    });
                    setKernel('custom');
                    if (Number.isNaN(+e.target.value)) return;
                    setUniform({
                      ...uniform,
                      'u_kernel[8]': +e.target.value,
                    });
                  }}
                />
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default KernelConvolution;
