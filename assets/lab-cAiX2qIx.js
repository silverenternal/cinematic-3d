import"./modulepreload-polyfill-B5Qt9EMX.js";import{W as X,a as O,F as W,P as $,c as V,D as j,d as H,k as K,M as J,J as Q,K as Z,O as tt}from"./three.module-CFyo1FaF.js";const _=Math.PI*2;function et(e,s,p){const t=e.getContext("2d"),i=2e3,b=()=>Math.min(window.devicePixelRatio||1,2),n={x:s/2,y:p/2,down:!1};let v=s,g=p;const c=new Float32Array(i*4);for(let a=0;a<i;a++)c[a*4]=Math.random()*v,c[a*4+1]=Math.random()*g,c[a*4+2]=(Math.random()-.5)*.4,c[a*4+3]=(Math.random()-.5)*.4;e.addEventListener("pointermove",a=>{const u=e.getBoundingClientRect();n.x=a.clientX-u.left,n.y=a.clientY-u.top}),e.addEventListener("pointerdown",()=>{n.down=!0}),e.addEventListener("pointerup",()=>{n.down=!1}),e.addEventListener("pointerleave",()=>{n.down=!1});function F(a){const u=b();t.save(),t.scale(u,u),t.fillStyle="rgba(10, 13, 18, 0.18)",t.fillRect(0,0,v,g);const f=.012,m=.92,l=6.5,r=220,h=r*r;for(let A=0;A<i;A++){const y=A*4;let M=c[y],o=c[y+1],d=c[y+2],w=c[y+3];const x=n.x-M,R=n.y-o,L=x*x+R*R;if(L<h){const T=Math.sqrt(L)||1e-4,z=(1-T/r)*f;d+=x/T*z,w+=R/T*z,n.down&&(d-=x/T*l,w-=R/T*l)}d*=m,w*=m,M+=d,o+=w,M<0&&(M+=v),M>v&&(M-=v),o<0&&(o+=g),o>g&&(o-=g),c[y]=M,c[y+1]=o,c[y+2]=d,c[y+3]=w;const S=Math.min(1,Math.sqrt(L)/r),U=30+S*18,q=70-S*30,I=55+(1-S)*18,Y=.85,N=1.4+(1-S)*1.2;t.fillStyle=`hsla(${U}, ${q}%, ${I}%, ${Y})`,t.beginPath(),t.arc(M,o,N,0,_),t.fill()}if(!n._hidden){const A=t.createRadialGradient(n.x,n.y,0,n.x,n.y,90);A.addColorStop(0,"rgba(198, 154, 85, 0.18)"),A.addColorStop(1,"rgba(198, 154, 85, 0)"),t.fillStyle=A,t.beginPath(),t.arc(n.x,n.y,90,0,_),t.fill()}t.restore(),E=requestAnimationFrame(F)}let E=requestAnimationFrame(F);return{resize:()=>{const a=e.getBoundingClientRect();v=a.width,g=a.height,e.width=Math.floor(v*b()),e.height=Math.floor(g*b())},stop:()=>cancelAnimationFrame(E)}}const ot=`
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`,it=`
precision highp float;
varying vec2 vUv;
uniform vec2  uRes;
uniform float uTime;
uniform vec2  uMouse;     // 0..1
uniform float uMouseActive;

#define PI 3.14159265359

// hash
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i),          hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = vUv;
  vec2 m  = uMouse;

  // aspect-corrected uv
  vec2 p = (gl_FragCoord.xy / uRes.xy) * 2.0 - 1.0;
  p.x *= uRes.x / uRes.y;

  // mouse warp
  vec2 d = p - (m * 2.0 - 1.0) * vec2(uRes.x / uRes.y, 1.0);
  float dist = length(d);
  float warp = 1.0 / (1.0 + dist * 4.0) * uMouseActive * 0.5;

  // domain warp via fbm
  vec2 q = uv * 3.0 + uTime * 0.05;
  float n = fbm(q + fbm(q + uTime * 0.1));
  vec2 colUv = uv + (n - 0.5) * 0.4 + d * warp * 0.6;

  // soft circles field
  float field = 0.0;
  for (int i = 0; i < 6; i++) {
    float fi = float(i);
    vec2 c = vec2(
      0.5 + 0.35 * sin(uTime * 0.2 + fi * 1.3),
      0.5 + 0.35 * cos(uTime * 0.17 + fi * 0.7)
    );
    float r = 0.18 + 0.05 * sin(uTime * 0.4 + fi);
    float cd = length(colUv - c);
    field += smoothstep(r, r * 0.4, cd) * (0.5 + 0.5 * sin(uTime + fi));
  }
  field = clamp(field, 0.0, 1.4);

  // base gradient
  vec3 ink  = vec3(0.91, 0.84, 0.64);   // #e8d6a3
  vec3 gold = vec3(0.78, 0.60, 0.33);   // #c69a55
  vec3 deep = vec3(0.04, 0.05, 0.07);   // #0a0d12

  vec3 col = mix(deep, gold * 0.6, field * 0.7);
  col = mix(col, ink, smoothstep(0.5, 0.9, field));

  // grain
  float g = hash(gl_FragCoord.xy + uTime) - 0.5;
  col += g * 0.03;

  // vignette
  float v = smoothstep(1.2, 0.3, length(p));
  col *= mix(0.6, 1.0, v);

  gl_FragColor = vec4(col, 1.0);
}
`;function G(e,s,p){const t=e.createShader(s);if(e.shaderSource(t,p),e.compileShader(t),!e.getShaderParameter(t,e.COMPILE_STATUS))throw console.error(e.getShaderInfoLog(t)),new Error("shader compile failed");return t}function nt(e,s,p){const t=e.getContext("webgl",{antialias:!0,premultipliedAlpha:!1});if(!t)return e.getContext("2d").fillText("WebGL not available",20,30),{stop(){},resize(){}};const i=t.createProgram();if(t.attachShader(i,G(t,t.VERTEX_SHADER,ot)),t.attachShader(i,G(t,t.FRAGMENT_SHADER,it)),t.linkProgram(i),!t.getProgramParameter(i,t.LINK_STATUS))throw console.error(t.getProgramInfoLog(i)),new Error("link failed");t.useProgram(i);const b=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,b),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),t.STATIC_DRAW);const n=t.getAttribLocation(i,"aPos");t.enableVertexAttribArray(n),t.vertexAttribPointer(n,2,t.FLOAT,!1,0,0);const v=t.getUniformLocation(i,"uRes"),g=t.getUniformLocation(i,"uTime"),c=t.getUniformLocation(i,"uMouse"),F=t.getUniformLocation(i,"uMouseActive");let E=s,a=p,u=performance.now();const f={x:.5,y:.5,act:0};e.addEventListener("pointermove",r=>{const h=e.getBoundingClientRect();f.x=(r.clientX-h.left)/h.width,f.y=1-(r.clientY-h.top)/h.height,f.act=1}),e.addEventListener("pointerleave",()=>{f.act=0});function m(r){t.viewport(0,0,e.width,e.height),t.uniform2f(v,e.width,e.height),t.uniform1f(g,(r-u)*.001),t.uniform2f(c,f.x,f.y),t.uniform1f(F,f.act),t.drawArrays(t.TRIANGLES,0,3),f.act*=.985,l=requestAnimationFrame(m)}let l=requestAnimationFrame(m);return{resize:()=>{const r=e.getBoundingClientRect();E=r.width,a=r.height;const h=Math.min(window.devicePixelRatio||1,2);e.width=Math.floor(E*h),e.height=Math.floor(a*h)},stop:()=>cancelAnimationFrame(l)}}const P=4,B=1.4;function rt(e,s,p){const t=new X({canvas:e,antialias:!0,alpha:!1});t.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),t.setSize(s,p,!1),t.setClearColor(658706,1);const i=new O;i.fog=new W(658706,.06);const b=s/p,n=new $(45,b,.1,100);n.position.set(7,5,9),n.lookAt(0,0,0),i.add(new V(2239029,.6));const v=new j(16773590,1.4);v.position.set(4,6,5),i.add(v);const g=new H(13015637,1.2,30,1.5);g.position.set(-3,2,-3),i.add(g);const c=P*P*P,F=new K(.55,.55,.55),E=new J({color:1712176,metalness:.7,roughness:.3,flatShading:!0}),a=new Q(F,E,c);a.instanceMatrix.setUsage(Z);const u=new Float32Array(c*3);let f=0;for(let o=0;o<P;o++)for(let d=0;d<P;d++)for(let w=0;w<P;w++)u[f*3]=(o-(P-1)/2)*B,u[f*3+1]=(d-(P-1)/2)*B,u[f*3+2]=(w-(P-1)/2)*B,f++;i.add(a);const m={yaw:.6,pitch:.3,scroll:0},l={yaw:.6,pitch:.3,scroll:0},r={on:!1,lx:0,ly:0};e.style.cursor="grab",e.addEventListener("pointerdown",o=>{r.on=!0,r.lx=o.clientX,r.ly=o.clientY,e.style.cursor="grabbing"}),window.addEventListener("pointermove",o=>{r.on&&(m.yaw-=(o.clientX-r.lx)*.005,m.pitch-=(o.clientY-r.ly)*.005,m.pitch=Math.max(-1,Math.min(1,m.pitch)),r.lx=o.clientX,r.ly=o.clientY)}),window.addEventListener("pointerup",()=>{r.on=!1,e.style.cursor="grab"}),e.addEventListener("wheel",o=>{o.preventDefault(),m.scroll+=o.deltaY*.0015},{passive:!1});const h=new tt,A=performance.now();function y(o){const d=(o-A)*.001;l.yaw+=(m.yaw-l.yaw)*.08,l.pitch+=(m.pitch-l.pitch)*.08,l.scroll+=(m.scroll-l.scroll)*.08;const w=11;n.position.x=Math.cos(l.yaw)*Math.cos(l.pitch)*w,n.position.y=Math.sin(l.pitch)*w*.6+1.5,n.position.z=Math.sin(l.yaw)*Math.cos(l.pitch)*w,n.lookAt(0,0,0);for(let x=0;x<c;x++){const R=u[x*3],L=u[x*3+1],S=u[x*3+2],U=Math.sqrt(R*R+L*L+S*S),I=.7+.5*(Math.sin(U*.6-d*1.2+l.scroll*6)*.5+Math.cos(R*.5+d*.6)*.25+.5);h.position.set(R,L,S),h.rotation.set(d*.4+x,d*.3,d*.2),h.scale.setScalar(I),h.updateMatrix(),a.setMatrixAt(x,h.matrix)}a.instanceMatrix.needsUpdate=!0,g.intensity=1+Math.sin(d*1.4)*.5,t.render(i,n),M=requestAnimationFrame(y)}let M=requestAnimationFrame(y);return{resize:()=>{const o=e.getBoundingClientRect();t.setSize(o.width,o.height,!1),n.aspect=o.width/o.height,n.updateProjectionMatrix()},stop:()=>{cancelAnimationFrame(M),t.dispose()}}}const k=()=>Math.min(window.devicePixelRatio||1,2);function D(e){const s=e.getBoundingClientRect();return e.width=Math.max(1,Math.floor(s.width*k())),e.height=Math.max(1,Math.floor(s.height*k())),{w:s.width,h:s.height}}const C=[];window.addEventListener("load",()=>{const e=document.getElementById("cv-particles");if(e){const{w:t,h:i}=D(e);C.push(et(e,t,i))}const s=document.getElementById("cv-shader");if(s){const{w:t,h:i}=D(s);C.push(nt(s,t,i))}const p=document.getElementById("cv-array");if(p){const{w:t,h:i}=D(p);C.push(rt(p,t,i))}});window.addEventListener("resize",()=>{for(const e of C)e.resize&&e.resize()});
