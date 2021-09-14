import React, { useEffect, useRef } from "react";
import { Canvas } from "glsl-canvas-js";
import { withRedux } from "../redux";

function resize(canvas, image) {
  const deviceWidth = window.innerWidth / 480;
  canvas.style.width = Math.min(400 * deviceWidth, 480) + "px";
  canvas.style.height = Math.min(300 * deviceWidth, 360) + "px";
}

function GlslCanvas(props) {
  const CanvasRef = useRef();

  useEffect(() => {
    const canvas = new Canvas(CanvasRef.current, {
      vertexString: props.shader.vertex,
      fragmentString: props.shader.fragment
    });

    const updateCanvas = () => {
      const state = props.store.getState();

      canvas.loadTexture('u_img', state.img);

      canvas.setUniforms(state.uniform);
    }
    const listener = props.store.subscribe(updateCanvas);
    updateCanvas();

    const handleResize = () => resize(CanvasRef.current, props.store.getState().img);
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      listener();
      canvas.destroy();
    };
  }, [props.store, props.shader]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <canvas
        ref={CanvasRef}
      ></canvas>
    </div>
  )
}

export default withRedux(GlslCanvas);
