import"./modulepreload-polyfill-B5Qt9EMX.js";import{C as se,W as fe,S as pe,A as ie,a as me,F as ge,b as S,P as ve,c as we,D as q,d as Me,I as be,M as K,e as E,f as xe,g as G,B as Ce,h as O,T as Te,G as Se,O as _e,i as Pe,j as ye,k as Ee,V as g,l as H,m as N,n as J,o as $,p as Z,q as Ae,r as ee,s as T,U as L,t as d,u as B,H as F,N as Re,R as De,v as Be,w as Fe,L as Le,x as Ue,y as ze,z as ke,E as Ie}from"./three.module-CFyo1FaF.js";const x=Math.PI*2;class Ne{constructor(e){this.canvas=e,this.clock=new se,this.elapsed=0,this._initRenderer(),this._initScene(),this._initCamera(),this._initLights(),this._initWorldObjects(),this._initSpline(),this._initInteraction()}_initRenderer(){const e=new fe({canvas:this.canvas,antialias:!0,alpha:!1,powerPreference:"high-performance"});e.setPixelRatio(Math.min(window.devicePixelRatio,2)),e.setSize(window.innerWidth,window.innerHeight,!1),e.outputColorSpace=pe,e.toneMapping=ie,e.toneMappingExposure=1.15,e.setClearColor(396058,1),this.renderer=e}_initScene(){const e=new me;e.fog=new ge(396058,.022),e.background=new S(396058),this.scene=e}_initCamera(){const e=window.innerWidth/window.innerHeight,t=new ve(38,e,.1,200);t.position.set(0,1.2,12),t.lookAt(0,0,0),this.camera=t}_initLights(){const e=new we(2241348,.35);this.scene.add(e);const t=new q(13621738,1.6);t.position.set(4,6,5),this.scene.add(t);const i=new q(7315656,1.1);i.position.set(-5,2,-4),this.scene.add(i);const r=new Me(7322623,1.4,30,1.6);r.position.set(0,0,0),this.scene.add(r),this.fillLight=r}_initWorldObjects(){const e=new be(1.05,1),t=new K({color:396058,metalness:.95,roughness:.18,emissive:7322623,emissiveIntensity:.45,flatShading:!0}),i=new E(e,t);this.scene.add(i),this.subject=i;const r=new xe(1.55,32,32),a=new G({color:11190752,transparent:!0,opacity:.06,blending:O,side:Ce,depthWrite:!1}),s=new E(r,a);this.scene.add(s),this.halo=s;const o=new Te(2.4,.012,16,200),n=new G({color:11190752,transparent:!0,opacity:.35}),v=new E(o,n);v.rotation.x=Math.PI/2.2,this.scene.add(v),this.ring=v;const p=new Se;this.scene.add(p),this.debrisGroup=p;const u=220;new _e;const h=[],w=[new Pe(.07,0),new ye(.06,0),new Ee(.08,.08,.08)],he=new K({color:2899546,metalness:.6,roughness:.4,flatShading:!0});for(let l=0;l<u;l++){const y=w[l%w.length],m=new E(y,he),M=Math.random()*x,b=4+Math.random()*22,X=(Math.random()-.5)*14;m.position.set(Math.cos(M)*b,X,Math.sin(M)*b),m.rotation.set(Math.random()*x,Math.random()*x,Math.random()*x);const de=.5+Math.random()*1.2;m.scale.setScalar(de),m.userData={spin:new g((Math.random()-.5)*.4,(Math.random()-.5)*.4,(Math.random()-.5)*.4),bob:.4+Math.random()*.8,phase:Math.random()*x,baseY:X},p.add(m),h.push(m)}this.debris=h;const k=1500,A=new Float32Array(k*3),R=new Float32Array(k*3);for(let l=0;l<k;l++){const y=60+Math.random()*40,m=Math.random()*x,M=Math.acos(2*Math.random()-1);A[l*3]=y*Math.sin(M)*Math.cos(m),A[l*3+1]=y*Math.cos(M),A[l*3+2]=y*Math.sin(M)*Math.sin(m);const b=.5+Math.random()*.5;R[l*3]=b*.7,R[l*3+1]=b*.85,R[l*3+2]=b*.95}const I=new H;I.setAttribute("position",new N(A,3)),I.setAttribute("color",new N(R,3));const ce=new J({size:.18,vertexColors:!0,transparent:!0,opacity:.85,sizeAttenuation:!0,depthWrite:!1}),Q=new $(I,ce);this.scene.add(Q),this.stars=Q;const W=800,D=new Float32Array(W*3);for(let l=0;l<W;l++)D[l*3]=(Math.random()-.5)*40,D[l*3+1]=(Math.random()-.5)*18,D[l*3+2]=(Math.random()-.5)*40;const Y=new H;Y.setAttribute("position",new N(D,3));const ue=new J({color:11190752,size:.04,transparent:!0,opacity:.5,blending:O,depthWrite:!1,sizeAttenuation:!0}),j=new $(Y,ue);this.scene.add(j),this.dust=j}_initSpline(){const e=[{p:[0,1.2,12],l:[0,0,0],fov:38},{p:[3.5,2,9],l:[0,0,0],fov:42},{p:[6,.5,4],l:[0,0,0],fov:50},{p:[4,-.8,-2],l:[0,0,0],fov:55},{p:[0,-1.5,-6],l:[0,0,0],fov:48},{p:[-3,-.5,-4],l:[0,0,0],fov:52},{p:[-5,.4,0],l:[0,0,0],fov:45},{p:[-3.5,1.5,4],l:[0,0,0],fov:42},{p:[0,2.5,5],l:[0,0,0],fov:38},{p:[2.5,1.5,2],l:[0,0,0],fov:44},{p:[1,.3,-1],l:[0,0,0],fov:50},{p:[0,1.2,6],l:[0,0,0],fov:36}],t=new Z(e.map(r=>new g(...r.p)),!1,"catmullrom",.5),i=new Z(e.map(r=>new g(...r.l)),!1,"catmullrom",.5);this.stops=e,this.posCurve=t,this.lookCurve=i}_initInteraction(){this.progress=0,this.targetProgress=0,this.dragging=!1,this.lastX=0,this.lastY=0,this.orbitYaw=0,this.orbitPitch=0,this.targetYaw=0,this.targetPitch=0;const e=s=>{this.dragging=!0,this.lastX=s.clientX,this.lastY=s.clientY,document.body.classList.add("dragging")},t=s=>{if(!this.dragging)return;const o=s.clientX-this.lastX,n=s.clientY-this.lastY;this.lastX=s.clientX,this.lastY=s.clientY,this.targetYaw-=o*.004,this.targetPitch-=n*.003,this.targetPitch=Math.max(-.6,Math.min(.6,this.targetPitch))},i=()=>{this.dragging=!1,document.body.classList.remove("dragging")};this.canvas.addEventListener("pointerdown",e),window.addEventListener("pointermove",t),window.addEventListener("pointerup",i),window.addEventListener("pointercancel",i);const r=s=>{s.preventDefault();const o=s.deltaY;this.targetProgress=Math.max(0,Math.min(1,this.targetProgress+o*45e-5))};this.canvas.addEventListener("wheel",r,{passive:!1});let a=null;this.canvas.addEventListener("touchstart",s=>{s.touches.length===1?e(s.touches[0]):s.touches.length===2&&(a=Math.hypot(s.touches[0].clientX-s.touches[1].clientX,s.touches[0].clientY-s.touches[1].clientY))},{passive:!0}),this.canvas.addEventListener("touchmove",s=>{if(s.touches.length===1)t(s.touches[0]);else if(s.touches.length===2&&a!=null){const o=Math.hypot(s.touches[0].clientX-s.touches[1].clientX,s.touches[0].clientY-s.touches[1].clientY),n=a-o;a=o,this.targetProgress=Math.max(0,Math.min(1,this.targetProgress+n*8e-4))}},{passive:!0}),this.canvas.addEventListener("touchend",s=>{s.touches.length===0&&(i(),a=null)}),window.addEventListener("keydown",s=>{s.key==="ArrowRight"||s.key==="d"||s.key==="D"?this.targetProgress=Math.min(1,this.targetProgress+.05):(s.key==="ArrowLeft"||s.key==="a"||s.key==="A")&&(this.targetProgress=Math.max(0,this.targetProgress-.05))})}setProgress(e){this.targetProgress=Math.max(0,Math.min(1,e))}getChapter(){return Math.min(11,Math.floor(this.progress*11.999))}resize(){const e=window.innerWidth,t=window.innerHeight;this.renderer.setSize(e,t,!1),this.camera.aspect=e/t,this.camera.updateProjectionMatrix()}update(){const e=this.clock.getDelta();this.elapsed+=e,this.progress+=(this.targetProgress-this.progress)*Math.min(1,e*4),this.orbitYaw+=(this.targetYaw-this.orbitYaw)*Math.min(1,e*6),this.orbitPitch+=(this.targetPitch-this.orbitPitch)*Math.min(1,e*6);const t=this.progress,i=this.posCurve.getPoint(t).clone(),r=this.lookCurve.getPoint(t).clone();i.applyAxisAngle(new g(0,1,0),this.orbitYaw),i.y+=this.orbitPitch*2,this.camera.position.copy(i),this.camera.lookAt(r);const a=t*(this.stops.length-1),s=Math.floor(a),o=a-s,n=this.stops[Math.min(s,this.stops.length-1)].fov,v=this.stops[Math.min(s+1,this.stops.length-1)].fov,p=n+(v-n)*o;this.camera.fov+=(p-this.camera.fov)*Math.min(1,e*3),this.camera.updateProjectionMatrix(),this.subject.rotation.y+=e*.25,this.subject.rotation.x+=e*.1;const u=.95+Math.sin(this.elapsed*1.3)*.05;this.subject.scale.setScalar(u),this.subject.material.emissiveIntensity=.4+Math.sin(this.elapsed*.9)*.15,this.halo.scale.setScalar(1+Math.sin(this.elapsed*.8)*.05),this.halo.material.opacity=.05+Math.sin(this.elapsed*.6)*.02,this.ring.rotation.z+=e*.15,this.ring.rotation.y+=e*.05,this.fillLight.color.setHSL(.08,.6,.5),this.fillLight.intensity=1+Math.sin(this.elapsed*.7)*.4,this.stars.rotation.y+=e*.005,this.dust.rotation.y+=e*.02,this.dust.position.y=Math.sin(this.elapsed*.3)*.4;for(const h of this.debris)h.rotation.x+=h.userData.spin.x*e,h.rotation.y+=h.userData.spin.y*e,h.rotation.z+=h.userData.spin.z*e,h.position.y=h.userData.baseY+Math.sin(this.elapsed*h.userData.bob+h.userData.phase)*.4}render(){this.renderer.render(this.scene,this.camera)}}const ae={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class P{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const Ge=new Ae(-1,1,1,-1,0,1);class Oe extends H{constructor(){super(),this.setAttribute("position",new ee([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new ee([0,2,0,0,2,0],2))}}const He=new Oe;class V{constructor(e){this._mesh=new E(He,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,Ge)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class re extends P{constructor(e,t){super(),this.textureID=t!==void 0?t:"tDiffuse",e instanceof T?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=L.clone(e.uniforms),this.material=new T({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this.fsQuad=new V(this.material)}render(e,t,i){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=i.texture),this.fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class te extends P{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,i){const r=e.getContext(),a=e.state;a.buffers.color.setMask(!1),a.buffers.depth.setMask(!1),a.buffers.color.setLocked(!0),a.buffers.depth.setLocked(!0);let s,o;this.inverse?(s=0,o=1):(s=1,o=0),a.buffers.stencil.setTest(!0),a.buffers.stencil.setOp(r.REPLACE,r.REPLACE,r.REPLACE),a.buffers.stencil.setFunc(r.ALWAYS,s,4294967295),a.buffers.stencil.setClear(o),a.buffers.stencil.setLocked(!0),e.setRenderTarget(i),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),a.buffers.color.setLocked(!1),a.buffers.depth.setLocked(!1),a.buffers.color.setMask(!0),a.buffers.depth.setMask(!0),a.buffers.stencil.setLocked(!1),a.buffers.stencil.setFunc(r.EQUAL,1,4294967295),a.buffers.stencil.setOp(r.KEEP,r.KEEP,r.KEEP),a.buffers.stencil.setLocked(!0)}}class Ve extends P{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class Qe{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const i=e.getSize(new d);this._width=i.width,this._height=i.height,t=new B(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:F}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new re(ae),this.copyPass.material.blending=Re,this.clock=new se}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const t=this.renderer.getRenderTarget();let i=!1;for(let r=0,a=this.passes.length;r<a;r++){const s=this.passes[r];if(s.enabled!==!1){if(s.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(r),s.render(this.renderer,this.writeBuffer,this.readBuffer,e,i),s.needsSwap){if(i){const o=this.renderer.getContext(),n=this.renderer.state.buffers.stencil;n.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),n.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}te!==void 0&&(s instanceof te?i=!0:s instanceof Ve&&(i=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new d);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const i=this._width*this._pixelRatio,r=this._height*this._pixelRatio;this.renderTarget1.setSize(i,r),this.renderTarget2.setSize(i,r);for(let a=0;a<this.passes.length;a++)this.passes[a].setSize(i,r)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class We extends P{constructor(e,t,i=null,r=null,a=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=i,this.clearColor=r,this.clearAlpha=a,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new S}render(e,t,i){const r=e.autoClear;e.autoClear=!1;let a,s;this.overrideMaterial!==null&&(s=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(a=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:i),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(a),this.overrideMaterial!==null&&(this.scene.overrideMaterial=s),e.autoClear=r}}const Ye={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new S(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class _ extends P{constructor(e,t,i,r){super(),this.strength=t!==void 0?t:1,this.radius=i,this.threshold=r,this.resolution=e!==void 0?new d(e.x,e.y):new d(256,256),this.clearColor=new S(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let a=Math.round(this.resolution.x/2),s=Math.round(this.resolution.y/2);this.renderTargetBright=new B(a,s,{type:F}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let u=0;u<this.nMips;u++){const h=new B(a,s,{type:F});h.texture.name="UnrealBloomPass.h"+u,h.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(h);const w=new B(a,s,{type:F});w.texture.name="UnrealBloomPass.v"+u,w.texture.generateMipmaps=!1,this.renderTargetsVertical.push(w),a=Math.round(a/2),s=Math.round(s/2)}const o=Ye;this.highPassUniforms=L.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=r,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new T({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];const n=[3,5,7,9,11];a=Math.round(this.resolution.x/2),s=Math.round(this.resolution.y/2);for(let u=0;u<this.nMips;u++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(n[u])),this.separableBlurMaterials[u].uniforms.invSize.value=new d(1/a,1/s),a=Math.round(a/2),s=Math.round(s/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const v=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=v,this.bloomTintColors=[new g(1,1,1),new g(1,1,1),new g(1,1,1),new g(1,1,1),new g(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;const p=ae;this.copyUniforms=L.clone(p.uniforms),this.blendMaterial=new T({uniforms:this.copyUniforms,vertexShader:p.vertexShader,fragmentShader:p.fragmentShader,blending:O,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new S,this.oldClearAlpha=1,this.basic=new G,this.fsQuad=new V(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(e,t){let i=Math.round(e/2),r=Math.round(t/2);this.renderTargetBright.setSize(i,r);for(let a=0;a<this.nMips;a++)this.renderTargetsHorizontal[a].setSize(i,r),this.renderTargetsVertical[a].setSize(i,r),this.separableBlurMaterials[a].uniforms.invSize.value=new d(1/i,1/r),i=Math.round(i/2),r=Math.round(r/2)}render(e,t,i,r,a){e.getClearColor(this._oldClearColor),this.oldClearAlpha=e.getClearAlpha();const s=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),a&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=i.texture,e.setRenderTarget(null),e.clear(),this.fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=i.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this.fsQuad.render(e);let o=this.renderTargetBright;for(let n=0;n<this.nMips;n++)this.fsQuad.material=this.separableBlurMaterials[n],this.separableBlurMaterials[n].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[n].uniforms.direction.value=_.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[n]),e.clear(),this.fsQuad.render(e),this.separableBlurMaterials[n].uniforms.colorTexture.value=this.renderTargetsHorizontal[n].texture,this.separableBlurMaterials[n].uniforms.direction.value=_.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[n]),e.clear(),this.fsQuad.render(e),o=this.renderTargetsVertical[n];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this.fsQuad.render(e),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,a&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(i),this.fsQuad.render(e)),e.setClearColor(this._oldClearColor,this.oldClearAlpha),e.autoClear=s}getSeperableBlurMaterial(e){const t=[];for(let i=0;i<e;i++)t.push(.39894*Math.exp(-.5*i*i/(e*e))/e);return new T({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new d(.5,.5)},direction:{value:new d(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`})}getCompositeMaterial(e){return new T({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`})}}_.BlurDirectionX=new d(1,0);_.BlurDirectionY=new d(0,1);const je={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`
	
		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};class Xe extends P{constructor(){super();const e=je;this.uniforms=L.clone(e.uniforms),this.material=new De({name:e.name,uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader}),this.fsQuad=new V(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,i){this.uniforms.tDiffuse.value=i.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},Be.getTransfer(this._outputColorSpace)===Fe&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Le?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===Ue?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===ze?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===ie?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===ke?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===Ie&&(this.material.defines.NEUTRAL_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}const qe={uniforms:{tDiffuse:{value:null},uTime:{value:0},uAberration:{value:.0028},uGrain:{value:.07},uVignette:{value:1.15},uContrast:{value:1.08},uTint:{value:new S(16773590)}},vertexShader:`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,fragmentShader:`
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uAberration;
    uniform float uGrain;
    uniform float uVignette;
    uniform float uContrast;
    uniform vec3  uTint;
    varying vec2 vUv;

    // hash-based grain
    float rand(vec2 co) {
      return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
    }

    void main() {
      vec2 uv = vUv;
      vec2 center = vec2(0.5);
      vec2 dir = uv - center;
      float dist = length(dir);

      // ---- chromatic aberration (radial) ----
      vec2 ca = dir * uAberration;
      float r = texture2D(tDiffuse, uv - ca).r;
      float g = texture2D(tDiffuse, uv).g;
      float b = texture2D(tDiffuse, uv + ca).b;
      vec3 col = vec3(r, g, b);

      // ---- contrast + slight tint ----
      col = (col - 0.5) * uContrast + 0.5;
      col = mix(col, col * uTint, 0.12);

      // ---- vignette (soft + film black) ----
      float vig = smoothstep(0.85, 0.25, dist);
      col *= mix(1.0 - 0.65 / uVignette, 1.0, vig);

      // ---- film grain ----
      float n = rand(uv * vec2(1920.0, 1080.0) + uTime * 13.0);
      col += (n - 0.5) * uGrain;

      // ---- soft toe (lift shadows toward warm) ----
      col = pow(col, vec3(0.95, 0.97, 1.02));

      gl_FragColor = vec4(col, 1.0);
    }
  `};class Ke{constructor(e,t,i){const r=window.innerWidth,a=window.innerHeight;this.composer=new Qe(e),this.composer.setSize(r,a),this.composer.setPixelRatio(Math.min(window.devicePixelRatio,2));const s=new We(t,i);this.composer.addPass(s);const o=new _(new d(r,a),.85,.6,.55);this.bloom=o,this.composer.addPass(o),this.cinematicPass=new re(qe),this.composer.addPass(this.cinematicPass);const n=new Xe;this.composer.addPass(n)}setSize(e,t){this.composer.setSize(e,t),this.bloom.setSize(e,t)}update(e){this.cinematicPass.uniforms.uTime.value=e}render(){this.composer.render()}}const C=[{title:"Awakening",lede:"A new year opens with a single, quiet light in the dark."},{title:"Drift",lede:"Snow falls on cities that have not yet learned to listen."},{title:"Approach",lede:"A voice finds its way through the noise of an old world."},{title:"Undertow",lede:"The river of consensus begins to bend, slowly, against itself."},{title:"Descent",lede:"Crowds gather. The square fills with the sound of a single question."},{title:"Turn",lede:"What was once a fringe becomes the loudest thing in the room."},{title:"Cross",lede:"An ocean crossed. A continent answered. The arithmetic is the same."},{title:"Ascent",lede:"Steps climbed, hands joined, the year turning into a verdict."},{title:"Bloom",lede:"Where there was one, there are millions. The season changes."},{title:"Hush",lede:"Even the loudest movements must learn to be still."},{title:"Echo",lede:"The words travel further than the speaker ever will."},{title:"Return",lede:"A year older, a year closer — and the light is still on."}];class Je{constructor(){this.titleEl=document.getElementById("chapter-title"),this.ledeEl=document.getElementById("chapter-lede"),this.indexEl=document.getElementById("frame-index"),this.chapterEl=document.getElementById("chapter"),this.progressEl=document.getElementById("rail-progress"),this.railEl=document.getElementById("rail"),this.currentChapter=-1,this._buildTicks()}_buildTicks(){const e=document.getElementById("rail-ticks");if(e){e.innerHTML="";for(let t=0;t<C.length;t++){const i=document.createElement("span");i.className="tick",i.textContent=String(t+1).padStart(2,"0"),i.addEventListener("click",()=>{this.onJump&&this.onJump(t/(C.length-1))}),e.appendChild(i)}this.tickEls=Array.from(e.querySelectorAll(".tick"))}}onJumpToChapter(e){this.onJump=e}update(e){this.progressEl&&(this.progressEl.style.width=`${(e*100).toFixed(2)}%`);const t=Math.min(C.length-1,Math.floor(e*C.length*.9999));if(t!==this.currentChapter){this.currentChapter=t;const i=C[t];this.titleEl.textContent=i.title,this.ledeEl.textContent=i.lede,this.indexEl.textContent=`${String(t+1).padStart(2,"0")} / ${String(C.length).padStart(2,"0")}`,this.chapterEl.classList.remove("is-visible"),this.chapterEl.offsetWidth,requestAnimationFrame(()=>this.chapterEl.classList.add("is-visible")),this.tickEls.forEach((r,a)=>r.classList.toggle("is-active",a===t))}}}const oe=document.getElementById("stage");if(!oe)throw new Error("Stage canvas not found");const f=new Ne(oe),U=new Ke(f.renderer,f.scene,f.camera),z=new Je;requestAnimationFrame(()=>z.update(0));z.onJumpToChapter(c=>f.setProgress(c));window.addEventListener("resize",()=>{f.resize(),U.setSize(window.innerWidth,window.innerHeight)});let ne=performance.now();const $e=()=>{ne=performance.now()};["pointerdown","pointermove","wheel","keydown","touchstart","touchmove"].forEach(c=>window.addEventListener(c,$e,{passive:!0}));function le(){performance.now()-ne>6e3&&(f.targetProgress=Math.min(1,f.targetProgress+8e-4)),f.update(),U.update(f.elapsed),U.render(),z.update(f.progress),requestAnimationFrame(le)}requestAnimationFrame(le);window.__cinematic={world:f,post:U,overlay:z};
