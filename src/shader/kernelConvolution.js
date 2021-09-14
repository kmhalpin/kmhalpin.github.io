import {
  Typography,
  FormControlLabel,
  FormControl,
  Checkbox,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Input
} from "@material-ui/core";

const kernels = {
  normal: [
    0, 0, 0,
    0, 1, 0,
    0, 0, 0
  ],
  gaussianBlur: [
    0.045, 0.122, 0.045,
    0.122, 0.332, 0.122,
    0.045, 0.122, 0.045
  ],
  gaussianBlur2: [
    1, 2, 1,
    2, 4, 2,
    1, 2, 1
  ],
  gaussianBlur3: [
    0, 1, 0,
    1, 1, 1,
    0, 1, 0
  ],
  unsharpen: [
    -1, -1, -1,
    -1, 9, -1,
    -1, -1, -1
  ],
  sharpness: [
    0, -1, 0,
    -1, 5, -1,
    0, -1, 0
  ],
  sharpen: [
    -1, -1, -1,
    -1, 16, -1,
    -1, -1, -1
  ],
  edgeDetect: [
    -0.125, -0.125, -0.125,
    -0.125, 1, -0.125,
    -0.125, -0.125, -0.125
  ],
  edgeDetect2: [
    -1, -1, -1,
    -1, 8, -1,
    -1, -1, -1
  ],
  edgeDetect3: [
    -5, 0, 0,
    0, 0, 0,
    0, 0, 5
  ],
  edgeDetect4: [
    -1, -1, -1,
    0, 0, 0,
    1, 1, 1
  ],
  edgeDetect5: [
    -1, -1, -1,
    2, 2, 2,
    -1, -1, -1
  ],
  edgeDetect6: [
    -5, -5, -5,
    -5, 39, -5,
    -5, -5, -5
  ],
  sobelHorizontal: [
    1, 2, 1,
    0, 0, 0,
    -1, -2, -1
  ],
  sobelVertical: [
    1, 0, -1,
    2, 0, -2,
    1, 0, -1
  ],
  previtHorizontal: [
    1, 1, 1,
    0, 0, 0,
    -1, -1, -1
  ],
  previtVertical: [
    1, 0, -1,
    1, 0, -1,
    1, 0, -1
  ],
  boxBlur: [
    0.111, 0.111, 0.111,
    0.111, 0.111, 0.111,
    0.111, 0.111, 0.111
  ],
  triangleBlur: [
    0.0625, 0.125, 0.0625,
    0.125, 0.25, 0.125,
    0.0625, 0.125, 0.0625
  ],
  emboss: [
    -2, -1, 0,
    -1, 1, 1,
    0, 1, 2
  ]
};

const images = [
  {
    url: '/gl-image-processing/sample/Chrysanthemum.jpg',
    name: 'Chrysanthemum'
  },
  {
    url: '/gl-image-processing/sample/Desert.jpg',
    name: 'Desert'
  },
  {
    url: '/gl-image-processing/sample/Hydrangeas.jpg',
    name: 'Hydrangeas'
  },
  {
    url: '/gl-image-processing/sample/Jellyfish.jpg',
    name: 'Jellyfish'
  },
  {
    url: '/gl-image-processing/sample/Koala.jpg',
    name: 'Koala'
  },
  {
    url: '/gl-image-processing/sample/Lighthouse.jpg',
    name: 'Lighthouse'
  },
  {
    url: '/gl-image-processing/sample/Penguins.jpg',
    name: 'Penguins'
  },
  {
    url: '/gl-image-processing/sample/Tulips.jpg',
    name: 'Tulips'
  },
];

export const state = {
  kernel: 'normal',
  bnw: true,
  img: images[0].url,
  kernel_0: 0,
  kernel_1: 0,
  kernel_2: 0,
  kernel_3: 0,
  kernel_4: 1,
  kernel_5: 0,
  kernel_6: 0,
  kernel_7: 0,
  kernel_8: 0,
  c_kernel_0: 0,
  c_kernel_1: 0,
  c_kernel_2: 0,
  c_kernel_3: 0,
  c_kernel_4: 1,
  c_kernel_5: 0,
  c_kernel_6: 0,
  c_kernel_7: 0,
  c_kernel_8: 0
};

export const dispatch = (state, storeState) => {
  const kernel_0 = !isNaN(+state.kernel_0) ? +state.kernel_0 : storeState.uniform['u_kernel[0]']
  const kernel_1 = !isNaN(+state.kernel_1) ? +state.kernel_1 : storeState.uniform['u_kernel[1]']
  const kernel_2 = !isNaN(+state.kernel_2) ? +state.kernel_2 : storeState.uniform['u_kernel[2]']
  const kernel_3 = !isNaN(+state.kernel_3) ? +state.kernel_3 : storeState.uniform['u_kernel[3]']
  const kernel_4 = !isNaN(+state.kernel_4) ? +state.kernel_4 : storeState.uniform['u_kernel[4]']
  const kernel_5 = !isNaN(+state.kernel_5) ? +state.kernel_5 : storeState.uniform['u_kernel[7]']
  const kernel_6 = !isNaN(+state.kernel_6) ? +state.kernel_6 : storeState.uniform['u_kernel[6]']
  const kernel_7 = !isNaN(+state.kernel_7) ? +state.kernel_7 : storeState.uniform['u_kernel[7]']
  const kernel_8 = !isNaN(+state.kernel_8) ? +state.kernel_8 : storeState.uniform['u_kernel[8]']
  return {
    img: state.img,
    uniform: {
      u_doGray: state.bnw,
      'u_kernel[0]': kernel_0,
      'u_kernel[1]': kernel_1,
      'u_kernel[2]': kernel_2,
      'u_kernel[3]': kernel_3,
      'u_kernel[4]': kernel_4,
      'u_kernel[5]': kernel_5,
      'u_kernel[6]': kernel_6,
      'u_kernel[7]': kernel_7,
      'u_kernel[8]': kernel_8,
      u_kernelWeight:
        +((v =
          kernel_0 + kernel_1 + kernel_2 +
          kernel_3 + kernel_4 + kernel_5 +
          kernel_6 + kernel_7 + kernel_8) =>
          v <= 0 ? 1 : v)()
    }
  };
};

function setCustom(state) {
  return {
    c_kernel_0: state.kernel_0,
    c_kernel_1: state.kernel_1,
    c_kernel_2: state.kernel_2,
    c_kernel_3: state.kernel_3,
    c_kernel_4: state.kernel_4,
    c_kernel_5: state.kernel_5,
    c_kernel_6: state.kernel_6,
    c_kernel_7: state.kernel_7,
    c_kernel_8: state.kernel_8,
  }
}

export const form = (state, setState) => {
  return (
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
            value={state.img}
            onChange={e => setState({
              ...state,
              img: e.target.value
            })}
            label="Pilih gambar"
          >
            {images.map((v, idx) => (<MenuItem key={idx} value={v.url}>
              <img src={v.url} alt={v.name} height={25} /> {v.name}
            </MenuItem>))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={4}>
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
      </Grid>
      <Grid item xs={12}>
        <FormControl
          variant="outlined"
          style={{ width: '100%' }}
        >
          <InputLabel id="demo-simple-select-outlined-label">Pilih kernel mask</InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={state.kernel}
            onChange={e => {
              if (e.target.value === 'custom') {
                return setState({
                  ...state,
                  kernel: e.target.value,
                  kernel_0: state.c_kernel_0,
                  kernel_1: state.c_kernel_1,
                  kernel_2: state.c_kernel_2,
                  kernel_3: state.c_kernel_3,
                  kernel_4: state.c_kernel_4,
                  kernel_5: state.c_kernel_5,
                  kernel_6: state.c_kernel_6,
                  kernel_7: state.c_kernel_7,
                  kernel_8: state.c_kernel_8
                });
              }
              const kernel = kernels[e.target.value];
              setState({
                ...state,
                kernel: e.target.value,
                kernel_0: kernel[0],
                kernel_1: kernel[1],
                kernel_2: kernel[2],
                kernel_3: kernel[3],
                kernel_4: kernel[4],
                kernel_5: kernel[5],
                kernel_6: kernel[6],
                kernel_7: kernel[7],
                kernel_8: kernel[8]
              })
            }}
            label="Pilih kernel mask"
          >
            <MenuItem key='custom' value='custom'>
              Custom
            </MenuItem>
            {Object.keys(kernels).map((key, idx) => (<MenuItem key={idx} value={key}>
              {key}
            </MenuItem>))}
          </Select>
        </FormControl>
      </Grid>
      <Grid container item justifyContent="center" alignItems="center" spacing={1} xs={12}>
        <Grid item xs={12}>
          <Typography gutterBottom>Kernel</Typography>
        </Grid>
        <Grid item xs={4}>
          <FormControl
            variant="outlined"
            style={{ width: '100%' }}
          >
            <InputLabel htmlFor="kernel-0">Index 0</InputLabel>
            <Input id='kernel-0' type='text' value={state.kernel_0} onChange={e => setState({
              ...state,
              ...setCustom(state),
              kernel: 'custom',
              kernel_0: e.target.value,
              c_kernel_0: e.target.value
            })} />
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <FormControl
            variant="outlined"
            style={{ width: '100%' }}
          >
            <InputLabel htmlFor="kernel-1">Index 1</InputLabel>
            <Input id='kernel-1' type='text' value={state.kernel_1} onChange={e => setState({
              ...state,
              ...setCustom(state),
              kernel: 'custom',
              kernel_1: e.target.value,
              c_kernel_1: e.target.value
            })} />
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <FormControl
            variant="outlined"
            style={{ width: '100%' }}
          >
            <InputLabel htmlFor="kernel-2">Index 2</InputLabel>
            <Input id='kernel-2' type='text' value={state.kernel_2} onChange={e => setState({
              ...state,
              ...setCustom(state),
              kernel: 'custom',
              kernel_2: e.target.value,
              c_kernel_2: e.target.value
            })} />
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <FormControl
            variant="outlined"
            style={{ width: '100%' }}
          >
            <InputLabel htmlFor="kernel-3">Index 3</InputLabel>
            <Input id='kernel-3' type='text' value={state.kernel_3} onChange={e => setState({
              ...state,
              ...setCustom(state),
              kernel: 'custom',
              kernel_3: e.target.value,
              c_kernel_3: e.target.value
            })} />
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <FormControl
            variant="outlined"
            style={{ width: '100%' }}
          >
            <InputLabel htmlFor="kernel-4">Index 4</InputLabel>
            <Input id='kernel-4' type='text' value={state.kernel_4} onChange={e => setState({
              ...state,
              ...setCustom(state),
              kernel: 'custom',
              kernel_4: e.target.value,
              c_kernel_4: e.target.value
            })} />
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <FormControl
            variant="outlined"
            style={{ width: '100%' }}
          >
            <InputLabel htmlFor="kernel-5">Index 5</InputLabel>
            <Input id='kernel-5' type='text' value={state.kernel_5} onChange={e => setState({
              ...state,
              ...setCustom(state),
              kernel: 'custom',
              kernel_5: e.target.value,
              c_kernel_5: e.target.value
            })} />
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <FormControl
            variant="outlined"
            style={{ width: '100%' }}
          >
            <InputLabel htmlFor="kernel-6">Index 6</InputLabel>
            <Input id='kernel-6' type='text' value={state.kernel_6} onChange={e => setState({
              ...state,
              ...setCustom(state),
              kernel: 'custom',
              kernel_6: e.target.value,
              c_kernel_6: e.target.value
            })} />
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <FormControl
            variant="outlined"
            style={{ width: '100%' }}
          >
            <InputLabel htmlFor="kernel-7">Index 7</InputLabel>
            <Input id='kernel-7' type='text' value={state.kernel_7} onChange={e => setState({
              ...state,
              ...setCustom(state),
              kernel: 'custom',
              kernel_7: e.target.value,
              c_kernel_7: e.target.value
            })} />
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <FormControl
            variant="outlined"
            style={{ width: '100%' }}
          >
            <InputLabel htmlFor="kernel-8">Index 8</InputLabel>
            <Input id='kernel-8' type='text' value={state.kernel_8} onChange={e => setState({
              ...state,
              ...setCustom(state),
              kernel: 'custom',
              kernel_8: e.target.value,
              c_kernel_8: e.target.value
            })} />
          </FormControl>
        </Grid>
      </Grid>
    </Grid>)
};

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
uniform vec2 u_resolution;
uniform float u_kernel[9];
uniform float u_kernelWeight;

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
}
`;
