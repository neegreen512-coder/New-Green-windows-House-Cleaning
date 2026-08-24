"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

const VERT = `attribute vec2 p;varying vec2 vUv;void main(){vUv=p*0.5+0.5;gl_Position=vec4(p,0.,1.);}`;

/** Flowing water streams: teal-green currents that meander diagonally across
 *  the warm stone ground. Directional, not random; kept readable behind content. */
const FRAG = `
precision highp float;
varying vec2 vUv;
uniform float uT; uniform vec2 uRes;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.02+3.1;a*=.5;}return v;}
void main(){
  vec2 uv=vUv; float ar=uRes.x/max(uRes.y,1.0); vec2 p=vec2(uv.x*ar,uv.y);
  vec2 dir=normalize(vec2(1.0,0.32));
  float along=dot(p,dir);
  float across=dot(p,vec2(-dir.y,dir.x));
  float t=uT*0.06;
  float warp=fbm(vec2(across*1.6, along*1.2 - t*2.0))*0.6;
  float s1=fbm(vec2(across*7.0 + warp*3.0, along*1.6 - t*5.0));
  float s2=fbm(vec2(across*13.0 - 4.0 + warp*2.0, along*2.4 - t*7.5));
  float stream=s1*0.62+s2*0.38;
  vec3 stone=vec3(0.957,0.953,0.925);
  vec3 water=vec3(0.13,0.50,0.49);
  vec3 col=stone;
  col=mix(col, mix(stone,water,0.62), smoothstep(0.40,0.80,stream)*0.26);
  float crest=pow(smoothstep(0.60,0.86,stream),2.0);
  col+=vec3(0.42,0.86,0.80)*crest*0.20;
  float lines=sin((along*90.0 + stream*10.0 - uT*1.4))*0.5+0.5;
  col+=vec3(0.4,0.82,0.74)*pow(lines,6.0)*crest*0.14;
  col-=vec3(0.05,0.04,0.02)*smoothstep(0.40,0.10,stream)*0.34;
  gl_FragColor=vec4(col,1.0);
}`;

export function WaterBackground() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { alpha: false, antialias: false });
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
    const uT = gl.getUniformLocation(prog, "uT");
    const uRes = gl.getUniformLocation(prog, "uRes");

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const resize = () => {
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const start = performance.now();
    let raf = 0;
    let running = true;
    const draw = () => {
      gl.uniform1f(uT, (performance.now() - start) / 1000);
      gl.uniform2f(uRes, canvas.width, canvas.height);
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

    if (reduce) draw();
    else loop();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [reduce]);

  return <canvas ref={ref} aria-hidden="true" className="fixed inset-0 -z-10 h-full w-full" />;
}
