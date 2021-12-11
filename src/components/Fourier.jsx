import React, { createRef, useEffect, useState } from 'react';
import { Canvas } from 'glsl-canvas-js/dist/cjs/glsl';
import {
  Grid,
  FormGroup,
  FormControl,
  Slider,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';
import { resize, images } from '../utils';

const vertex = `
attribute vec2 a_position;
attribute vec2 a_texcoord;

varying vec2 v_texcoord;

void main() {
  v_texcoord = a_texcoord;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const fragment = `
precision highp float;

const float PI = 3.14159265;
uniform sampler2D u_input;

uniform float u_slider;
uniform float u_resolution;
uniform float u_subtransformSize;

uniform bool u_horizontal;
uniform bool u_forward;
uniform bool u_normalize;

varying vec2 v_texcoord;

vec2 multiplyComplex (vec2 a, vec2 b) {
  return vec2(a[0] * b[0] - a[1] * b[1], a[1] * b[0] + a[0] * b[1]);
}

void main (void) {
  float index = 0.0;

  if (u_horizontal) {
    index = v_texcoord.x - 0.5;
  } else {
    index = v_texcoord.y - 0.5;
  }

  float evenIndex = floor(index / u_subtransformSize) * (u_subtransformSize / 2.0) + mod(index, u_subtransformSize / 2.0);
  vec4 even = vec4(0.0), odd = vec4(0.0);

  if (u_horizontal) {
    even = texture2D(u_input, vec2(evenIndex + 0.5, v_texcoord.y) / u_resolution);
    odd = texture2D(u_input, vec2(evenIndex + u_resolution * 0.5 + 0.5, v_texcoord.y) / u_resolution);
  } else {
    even = texture2D(u_input, vec2(v_texcoord.x, evenIndex + 0.5) / u_resolution);
    odd = texture2D(u_input, vec2(v_texcoord.x, evenIndex + u_resolution * 0.5 + 0.5) / u_resolution);
  }

  if (u_normalize) {
    even /= u_resolution * u_resolution;
    odd /= u_resolution * u_resolution;
  }

  float twiddleArgument = 0.0;

  if (u_forward) {
    twiddleArgument = 2.0 * PI * (index / u_subtransformSize);
  } else {
    twiddleArgument = -2.0 * PI * (index / u_subtransformSize);
  }

  vec2 twiddle = vec2(cos(twiddleArgument), sin(twiddleArgument));
  vec2 outputA = even.rg + multiplyComplex(twiddle, odd.rg);
  vec2 outputB = even.ba + multiplyComplex(twiddle, odd.ba);
  gl_FragColor = vec4(outputA, outputB);
}
`;

const CanvasRef = createRef();

function Fourier() {
  const [canvas, setCanvas] = useState(null);
  const [image, setImage] = useState(images[0].url);
  const [uniform, setUniform] = useState({
    u_slider: 0,
    u_subtransformSize: 2,
    u_horizontal: true,
    u_forward: true,
    u_normalize: false,
  });

  if (canvas instanceof Canvas) {
    canvas.loadTexture('u_input', image);
    canvas.setUniforms(uniform);
    resize(CanvasRef.current, image);
  }

  useEffect(() => {
    setCanvas(new Canvas(CanvasRef.current, {
      vertexString: vertex,
      fragmentString: fragment,
      extensions: ['OES_texture_float'],
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
    <>
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
      </FormGroup>
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
      </Grid>
    </>
  );
}

export default Fourier;
