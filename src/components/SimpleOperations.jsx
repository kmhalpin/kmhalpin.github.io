import React, { createRef, useEffect, useState } from 'react';
import { Canvas } from 'glsl-canvas-js/dist/cjs/glsl';
import {
  Grid,
  Typography,
  FormGroup,
  FormControl,
  FormControlLabel,
  Checkbox,
  Slider,
  InputLabel,
  Select,
  MenuItem,
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

uniform bool u_doGray;
uniform bool u_doNegative;
uniform bool u_doBinary;

uniform float u_slider;
uniform float u_binaryT;
uniform float u_brightness;

varying vec2 v_texcoord;

float rgbtobw (vec3 imgin) {
  return dot(imgin, vec3(1.0/3.0));
}

vec3 clipping (vec3 imgin) {
  return max(min(imgin, 1.0), 0.0);
}

vec3 brightnessfunc (vec3 imgin) {
  return clipping(imgin + u_brightness);
}

vec3 binaryfunc (vec3 imgin) {
  float gray = rgbtobw(imgin);
  if(gray < u_binaryT){
    return vec3(0.0);
  } else {
    return vec3(1.0);
  }
}

vec3 negativefunc (vec3 imgin) {
  return 1.0 - imgin;
}

void main(){
  vec4 texture = texture2D(u_img, v_texcoord);
  vec3 rgb = texture.rgb;

  if(u_doGray){
    rgb = vec3(rgbtobw(rgb));
  }

  rgb = brightnessfunc(rgb);

  if(u_doBinary){
    rgb = binaryfunc(rgb);
  }

  if(u_doNegative){
    rgb = negativefunc(rgb);
  }

  if (v_texcoord.x >= u_slider / u_resolution.x) {
    gl_FragColor = vec4(rgb, texture.a);
  } else {
    gl_FragColor = vec4(texture);
  }
}
`;

const CanvasRef = createRef();

function SimpleOperations() {
  const [canvas, setCanvas] = useState(null);
  const [image, setImage] = useState(images[0].url);
  const [uniform, setUniform] = useState({
    u_doGray: false,
    u_doNegative: false,
    u_doBinary: false,
    u_binaryT: 120,
    u_brightness: 0,
    u_slider: 0,
  });

  if (canvas instanceof Canvas) {
    canvas.loadTexture('u_img', image);
    canvas.setUniforms({
      ...uniform,
      u_binaryT: uniform.u_binaryT / 255.0,
      u_brightness: uniform.u_brightness / 255.0,
    });
    resize(CanvasRef.current, image);
  }

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
          step={1}
          min={0}
          max={CanvasRef.current?.width || 0}
          onChange={(e, newValue) => (newValue >= 0) && setUniform({
            ...uniform,
            u_slider: newValue,
          })}
        />
      </Grid>
      <Grid item xs={10} sm={10} md={10} lg={6} xl={4}>
        <FormGroup>
          <FormControl variant="outlined">
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
          <FormControlLabel
            control={(
              <Checkbox
                checked={uniform.u_doNegative}
                onChange={(e) => setUniform({
                  ...uniform,
                  u_doNegative: e.target.checked,
                })}
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
              )}
            label="Negatif"
          />
          <FormControlLabel
            control={(
              <Checkbox
                checked={uniform.u_doBinary}
                onChange={(e) => setUniform({
                  ...uniform,
                  u_doBinary: e.target.checked,
                })}
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
              )}
            label="Binerisasi"
          />
          <Slider
            disabled={!uniform.u_doBinary}
            color="secondary"
            value={uniform.u_binaryT}
            valueLabelDisplay="auto"
            step={1}
            min={0}
            max={255}
            onChange={(e, newValue) => (newValue >= 0 && newValue <= 255) && setUniform({
              ...uniform,
              u_binaryT: newValue,
            })}
          />
          <FormControl>
            <Typography id="brightness-slider" gutterBottom>
              Kecerahan
            </Typography>
            <Slider
              aria-labelledby="brightness-slider"
              value={uniform.u_brightness}
              valueLabelDisplay="auto"
              step={1}
              min={0}
              max={255}
              onChange={(e, newValue) => (newValue >= 0 && newValue <= 255) && setUniform({
                ...uniform,
                u_brightness: newValue,
              })}
            />
          </FormControl>
        </FormGroup>
      </Grid>
    </Grid>
  );
}

export default SimpleOperations;
