import {
  Typography,
  FormGroup,
  FormControl,
  FormControlLabel,
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
];

export const state = {
  img: images[0],
  bnw: false,
  negative: false,
  binary: false,
  binaryValue: 120,
  brightness: 0
}

export const dispatch = (state) => ({
  img: state.img,
  uniform: {
    u_doGray: state.bnw,
    u_doNegative: state.negative,
    u_doBinary: state.binary,
    u_binaryT: state.binaryValue / 255.0,
    u_brightness: state.brightness / 255.0
  }
})

export const form = (state, setState) => (
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
);

export const vertex = `
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
`

export const fragment = `
precision lowp float;

uniform sampler2D u_img;

uniform bool u_doGray;
uniform bool u_doNegative;
uniform bool u_doBinary;

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

  gl_FragColor = vec4(rgb, texture.a);
}
`;
