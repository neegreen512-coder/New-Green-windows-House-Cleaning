"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

const VERT = `attribute vec2 p;varying vec2 vUv;void main(){vUv=p*0.5+0.5;gl_Position=vec4(p,0.,1.);}`;

/** Small water-filled "New Green" wordmark for the header (letters only). */
const FRAG = `
precision highp float; varying vec2 vUv; uniform float uT; uniform sampler2D uMask;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);
 return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*noise(p);p=p*2.03+3.1;a*=.5;}return v;}
void main(){
  vec2 uv=vUv; float m=texture2D(uMask,uv).a; if(m<0.04) discard;
  vec2 fl=vec2(uT*0.13, uT*0.02);
  float s1=fbm(uv*vec2(9.,4.5)+fl*3.0);
  float s2=fbm(uv*vec2(18.,9.)-fl*4.0+4.0);
  vec3 deep=vec3(0.05,0.22,0.17), mid=vec3(0.10,0.42,0.30), shal=vec3(0.42,0.78,0.60);
  vec3 col=mix(deep,mid,smoothstep(0.0,1.0,uv.y));
  col=mix(col,shal,clamp(s1*0.7+s2*0.25,0.,1.));
  float c=pow(1.-abs(sin(uv.x*11.0+s1*7.0+uT*0.5)),8.0);
  col+=vec3(0.55,0.95,0.75)*c*0.28;
  float sp=fbm(uv*vec2(42.,20.)+uT*0.6); sp=smoothstep(0.8,0.95,sp);
  col+=vec3(1.0)*sp*0.5;
  gl_FragColor=vec4(col,m);
}`;

const W = 560;
const H = 120;

export function HeaderWaterLogo({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false });
    if (!gl) return;

    const compile = (t: number, s: string) => {
      const o = gl.createShader(t)!;
      gl.shaderSource(o, s);
      gl.compileShader(o);
      return o;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const mc = document.createElement("canvas");
    mc.width = W;
    mc.height = H;
    const mx = mc.getContext("2d")!;
    const tex = gl.createTexture();
    const paint = () => {
      let size = 100;
      mx.font = `700 ${size}px "Outfit", sans-serif`;
      size = (size * (W * 0.96)) / mx.measureText("New Green").width;
      mx.clearRect(0, 0, W, H);
      mx.fillStyle = "#fff";
      mx.textAlign = "center";
      mx.textBaseline = "middle";
      mx.font = `700 ${size}px "Outfit", sans-serif`;
      mx.fillText("New Green", W / 2, H * 0.52);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, mc);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    };

    gl.viewport(0, 0, W, H);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    const uT = gl.getUniformLocation(prog, "uT");
    gl.uniform1i(gl.getUniformLocation(prog, "uMask"), 0);

    const start = performance.now();
    let raf = 0;
    let running = true;
    const draw = () => {
      gl.uniform1f(uT, (performance.now() - start) / 1000);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    const loop = () => {
      draw();
      if (running && !reduce) raf = requestAnimationFrame(loop);
    };
    const onVis = () => {
      running = !document.hidden;
      if (running && !reduce) loop();
    };
    document.addEventListener("visibilitychange", onVis);

    const init = () => {
      paint();
      if (reduce) draw();
      else loop();
    };
    if (document.fonts?.ready) document.fonts.ready.then(init);
    else init();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [reduce]);

  return <canvas ref={ref} width={W} height={H} className={className} role="img" aria-label="New Green" />;
}
