import React, { useState, useEffect } from "react";
import { GLSL, Shaders, Node } from "gl-react";
import { Surface } from "gl-react-dom";
import {
  Typography,
  FormGroup,
  FormControl,
  FormControlLabel,
  Grid,
  Checkbox,
  Slider,
  InputLabel,
  Select,
  MenuItem
} from "@material-ui/core";

const images = [
  './sample/Chrysanthemum.jpg',
  './sample/Desert.jpg',
  './sample/Hydrangeas.jpg',
  './sample/Jellyfish.jpg',
  './sample/Koala.jpg',
  './sample/Lighthouse.jpg',
  './sample/Penguins.jpg',
  './sample/Tulips.jpg',
]

const shaders = Shaders.create({
  Operations: {
    frag: GLSL`
precision lowp float;
varying vec2 uv;

uniform sampler2D img;

uniform bool bnw;
uniform bool negative;
uniform bool binary;

uniform float binaryValue;
uniform float brightness;

float rgbtobw (vec3 imgin) {
  return dot(imgin, vec3(1.0/3.0));
}

vec3 clipping (vec3 imgin) {
  return max(min(imgin, 1.0), 0.0);
}

vec3 brightnessfunc (vec3 imgin) {
  return clipping(imgin + brightness / 255.0);
}

vec3 binaryfunc (vec3 imgin) {
  float gray = rgbtobw(imgin);
  if(gray < binaryValue / 255.0){
    return vec3(0.0);
  } else {
    return vec3(1.0);
  }
}

vec3 negativefunc (vec3 imgin) {
  return 1.0 - imgin;
}

void main(){
  vec4 texture = texture2D(img, uv);
  vec3 rgb = texture.rgb;

  if(bnw){
    rgb = vec3(rgbtobw(rgb));
  }

  rgb = brightnessfunc(rgb);

  if(binary){
    rgb = binaryfunc(rgb);
  }

  if(negative){
    rgb = negativefunc(rgb);
  }

  gl_FragColor = vec4(rgb, texture.a);
}
`
  }
});

function getWindowDimensions() {
  return 490 / window.innerWidth;
}

function App() {
  const [state, setState] = useState({
    img: images[0],
    bnw: false,
    negative: false,
    binary: false,
    binaryValue: 120,
    brightness: 0
  });

  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Grid container justifyContent="center" alignItems="center" spacing={2}>
      <Grid item>
        <Surface
          width={Math.min(4 * 100 / windowDimensions, 480)}
          height={Math.min(3 * 100 / windowDimensions, 360)}>
          <Node
            shader={shaders.Operations}
            uniforms={state}
          />
        </Surface>
      </Grid>
      <Grid item xs={10} sm={10} md={10} lg={6} xl={4}>
        <FormGroup>
          <FormControl variant="outlined">
            <InputLabel id="demo-simple-select-outlined-label">Pilih gambar</InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={state.img}
              onChange={e => setState({
                ...state,
                img: e.target.value
              })}
              label="Pilih gambar"
            >
              {images.map((v, idx) => (<MenuItem key={idx} value={v}>
                <img src={v} alt={v} height={25} /> {v}
              </MenuItem>))}
            </Select>
          </FormControl>
          <FormControlLabel
            control={<Checkbox
              checked={state.bnw}
              onChange={e => setState({
                ...state,
                bnw: e.target.checked
              })}
              inputProps={{ 'aria-label': 'primary checkbox' }}
            />}
            label='Hitam putih'
          />
          <FormControlLabel
            control={<Checkbox
              checked={state.negative}
              onChange={e => setState({
                ...state,
                negative: e.target.checked
              })}
              inputProps={{ 'aria-label': 'primary checkbox' }}
            />}
            label='Negatif'
          />
          <FormControlLabel
            control={<Checkbox
              checked={state.binary}
              onChange={e => setState({
                ...state,
                binary: e.target.checked
              })}
              inputProps={{ 'aria-label': 'primary checkbox' }}
            />}
            label='Binerisasi'
          />
          <Slider
            disabled={!state.binary}
            color='secondary'
            value={state.binaryValue}
            valueLabelDisplay="auto"
            step={1}
            min={0}
            max={255}
            onChange={(e, newValue) =>
              (newValue >= 0 && newValue <= 255) && setState({
                ...state,
                binaryValue: newValue
              })}
          />
          <FormControl>
            <Typography id="brightness-slider" gutterBottom>
              Kecerahan
            </Typography>
            <Slider
              aria-labelledby='brightness-slider'
              value={state.brightness}
              valueLabelDisplay="auto"
              step={1}
              min={0}
              max={255}
              onChange={(e, newValue) =>
                (newValue >= 0 && newValue <= 255) && setState({
                  ...state,
                  brightness: newValue
                })}
            />
          </FormControl>
        </FormGroup>
      </Grid>
    </Grid>
  );
}

export default App;
