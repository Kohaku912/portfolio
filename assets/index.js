var m = Object.defineProperty; var w = (o, e, s) => e in o ? m(o, e, { enumerable: !0, configurable: !0, writable: !0, value: s }) : o[e] = s; var t = (o, e, s) => w(o, typeof e != "symbol" ? e + "" : e, s); import { W as g, C as P, a as R, V as l, b as u, S as y, P as A, c as T, R as E, M as C } from "./vendor-three.js"; (function () { const e = document.createElement("link").relList; if (e && e.supports && e.supports("modulepreload")) return; for (const n of document.querySelectorAll('link[rel="modulepreload"]')) c(n); new MutationObserver(n => { for (const r of n) if (r.type === "childList") for (const h of r.addedNodes) h.tagName === "LINK" && h.rel === "modulepreload" && c(h) }).observe(document, { childList: !0, subtree: !0 }); function s(n) { const r = {}; return n.integrity && (r.integrity = n.integrity), n.referrerPolicy && (r.referrerPolicy = n.referrerPolicy), n.crossOrigin === "use-credentials" ? r.credentials = "include" : n.crossOrigin === "anonymous" ? r.credentials = "omit" : r.credentials = "same-origin", r } function c(n) { if (n.ep) return; n.ep = !0; const r = s(n); fetch(n.href, r) } })(); const d = class d { constructor() { t(this, "devicePixelRatio"); t(this, "clock"); t(this, "renderer"); t(this, "width"); t(this, "height"); t(this, "aspect"); t(this, "time"); t(this, "timeScale"); this.devicePixelRatio = window.devicePixelRatio, this.renderer = new g, this.clock = new P, this.width = window.innerWidth, this.height = window.innerHeight, this.aspect = this.width / this.height, this.time = 0, this.timeScale = 2 } init() { const e = new R(d.RENDERER_PARAM.clearColor); this.renderer.setClearColor(e, d.RENDERER_PARAM.alpha), this.resize() } resize() { this.width = window.innerWidth, this.height = window.innerHeight, this.aspect = this.width / this.height, this.renderer.setSize(this.width, this.height) } update() { this.time = this.clock.getElapsedTime() * this.timeScale } }; t(d, "RENDERER_PARAM", { clearColor: 16777215, alpha: 0, width: window.innerWidth, height: window.innerHeight }); let p = d; const i = new p; class M { constructor() { t(this, "pointerMoved"); t(this, "coords"); t(this, "prevCoords"); t(this, "diff"); t(this, "timer"); this.pointerMoved = !1, this.coords = new l, this.prevCoords = new l, this.diff = new l, this.timer = null, this.onPointerMove = this.onPointerMove.bind(this), this.onPointerDown = this.onPointerDown.bind(this) } init() { document.body.addEventListener("pointermove", this.onPointerMove, !1), document.body.addEventListener("pointerdown", this.onPointerDown, !1) } setCoords(e, s) { this.timer && clearTimeout(this.timer); const c = e / i.width * 2 - 1, n = -(s / i.height) * 2 + 1; this.coords.set(c, n), this.pointerMoved = !0, this.timer = setTimeout(() => { this.pointerMoved = !1 }, 100) } onPointerMove(e) { e.pointerType == "touch" && e.isPrimary ? this.setCoords(e.pageX, e.pageY) : this.setCoords(e.clientX, e.clientY) } onPointerDown(e) { e.pointerType !== "touch" || !e.isPrimary || this.setCoords(e.pageX, e.pageY) } update() { this.diff.subVectors(this.coords, this.prevCoords), this.prevCoords.copy(this.coords) } } const v = new M, D = `attribute vec3 position;
varying vec2 vTexCoord;

void main() {
    vTexCoord = position.xy * 0.5 + 0.5;
    gl_Position = vec4(position, 1.0);
}`, k = `precision mediump float;

const int TRAIL_LENGTH = 15;
const float EPS = 1e-4;
const int ITR = 16;
const float PI = acos(-1.0);

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uPointerTrail[TRAIL_LENGTH];

varying vec2 vTexCoord;

float rnd3D(vec3 p) {
    return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453123);
}

float noise3D(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);

    float a000 = rnd3D(i);
    float a100 = rnd3D(i + vec3(1.0, 0.0, 0.0));
    float a010 = rnd3D(i + vec3(0.0, 1.0, 0.0));
    float a110 = rnd3D(i + vec3(1.0, 1.0, 0.0));
    float a001 = rnd3D(i + vec3(0.0, 0.0, 1.0));
    float a101 = rnd3D(i + vec3(1.0, 0.0, 1.0));
    float a011 = rnd3D(i + vec3(0.0, 1.0, 1.0));
    float a111 = rnd3D(i + vec3(1.0, 1.0, 1.0));

    vec3 u = f * f * (3.0 - 2.0 * f);
    float k0 = a000;
    float k1 = a100 - a000;
    float k2 = a010 - a000;
    float k3 = a001 - a000;
    float k4 = a000 - a100 - a010 + a110;
    float k5 = a000 - a010 - a001 + a011;
    float k6 = a000 - a100 - a001 + a101;
    float k7 = -a000 + a100 + a010 - a110 + a001 - a101 - a011 + a111;

    return k0 + k1 * u.x + k2 * u.y + k3 *u.z + k4 * u.x * u.y + k5 * u.y * u.z + k6 * u.z * u.x + k7 * u.x * u.y * u.z;
}

// Camera
vec3 origin = vec3(0.0, 0.0, 1.0);
vec3 lookAt = vec3(0.0, 0.0, 0.0);
vec3 cDir = normalize(lookAt - origin);
vec3 cUp = vec3(0.0, 1.0, 0.0);
vec3 cSide = cross(cDir, cUp);

float smoothMin(float d1, float d2, float k) {
    float h = exp(-k * d1) + exp(-k * d2);
    return -log(h) / k;
}

vec3 translate(vec3 p, vec3 t) {
    return p - t;
}

float sdSphere(vec3 p, float s)
{
    return length(p) - s;
}

float map(vec3 p) {
    float baseRadius = 8e-3;
    float radius = baseRadius * float(TRAIL_LENGTH);
    float k = 7.;
    float d = 1e5;

    for (int i = 0; i < TRAIL_LENGTH; i++) {
        float fi = float(i);
        vec2 pointerTrail = uPointerTrail[i] * uResolution / min(uResolution.x, uResolution.y);

        float sphere = sdSphere(
                translate(p, vec3(pointerTrail, .0)),
                radius - baseRadius * fi
            );

        d = smoothMin(d, sphere, k);
    }

    float sphere = sdSphere(translate(p, vec3(1.0, -0.25, 0.0)), 0.55);
    d = smoothMin(d, sphere, k);

    return d;
}

vec3 generateNormal(vec3 p) {
    return normalize(vec3(
            map(p + vec3(EPS, 0.0, 0.0)) - map(p + vec3(-EPS, 0.0, 0.0)),
            map(p + vec3(0.0, EPS, 0.0)) - map(p + vec3(0.0, -EPS, 0.0)),
            map(p + vec3(0.0, 0.0, EPS)) - map(p + vec3(0.0, 0.0, -EPS))
        ));
}
float fresnel(vec3 viewDir, vec3 normal) {
    return pow(1.0 - max(dot(viewDir, normal), 0.0), 3.0) * 0.5;
}
vec3 dropletColor(vec3 normal, vec3 rayDir) {
    // より濃いブルー系に調整
    vec3 baseColor   = vec3(0.2, 0.4, 0.8);    // 深みのあるブルー
    vec3 accentColor = vec3(0.1, 0.2, 0.9);    // コントラストのある濃い青

    // ノイズはそのまま柔らかく
    float n = noise3D(normal * 2.0 + uTime * 0.5) * 0.5 
            + noise3D(normal * 4.0 - uTime * 0.5) * 0.25;

    // ベースとアクセントをミックス
    vec3 color = mix(baseColor, accentColor, n);

    // ハイライトに Fresnel（強度アップ）
    float f = fresnel(rayDir, normal);
    color += f * 0.3;  // 0.2 → 0.3 にして光沢を強調

    return color;
}


void main() {
    vec2 p = (gl_FragCoord.xy * 2.0 - uResolution) / min(uResolution.x, uResolution.y);
    vec3 ray = origin + cSide * p.x + cUp * p.y;
    vec3 rayDirection = cDir;
    float dist = 0.0;
    for (int i = 0; i < ITR; ++i) {
        dist = map(ray);
        ray += rayDirection * dist;
        if (dist < EPS) break;
    }
    vec3 color = vec3(0.0);
    if (dist < EPS) {
        vec3 normal = generateNormal(ray);
        color = dropletColor(normal, rayDirection);
    }
    vec3 finalColor = pow(color, vec3(1.0 / 2.2));
    gl_FragColor = vec4(finalColor, 1.0);
}
`, a = class a { constructor() { t(this, "scene"); t(this, "camera"); t(this, "uniforms"); t(this, "trailLength"); t(this, "pointerTrail"); this.scene = new y, this.camera = new A(a.CAMERA_PARAM.fovy, a.CAMERA_PARAM.aspect, a.CAMERA_PARAM.near, a.CAMERA_PARAM.far), this.trailLength = 15, this.pointerTrail = Array.from({ length: this.trailLength }, () => new l(0, 0)), this.uniforms = { uTime: { value: i.time }, uResolution: { value: new l(i.width, i.height) }, uPointerTrail: { value: this.pointerTrail } } } init() { this.camera.position.copy(a.CAMERA_PARAM.position), this.camera.lookAt(a.CAMERA_PARAM.lookAt); const e = new T(2, 2), s = new E({ vertexShader: D, fragmentShader: k, wireframe: !1, uniforms: this.uniforms }), c = new C(e, s); this.scene.add(c) } resize() { this.camera.aspect = i.aspect, this.camera.updateProjectionMatrix(), this.uniforms && this.uniforms.uResolution.value.set(i.width, i.height) } render() { this.uniforms && (this.uniforms.uTime.value = i.time), i.renderer.render(this.scene, this.camera) } update() { this.updatePointerTrail(), this.render() } updatePointerTrail() { for (let e = this.trailLength - 1; e > 0; e--)this.pointerTrail[e].copy(this.pointerTrail[e - 1]); this.pointerTrail[0].copy(v.coords) } }; t(a, "CAMERA_PARAM", { fovy: 60, aspect: window.innerWidth / window.innerHeight, near: .1, far: 50, position: new u(0, 0, 10), lookAt: new u(0, 0, 0) }); let f = a; class S { constructor(e) { t(this, "output"); t(this, "wrapper"); this.wrapper = e, this.output = new f, this.resize = this.resize.bind(this), this.render = this.render.bind(this), window.addEventListener("resize", this.resize) } init() { i.init(), v.init(), this.output.init() } setup() { this.wrapper.appendChild(i.renderer.domElement), this.resize(), i.clock.start() } render() { requestAnimationFrame(this.render), i.update(), this.output.update() } resize() { i.resize(), this.output.resize() } } window.addEventListener("DOMContentLoaded", () => { const o = document.querySelector("#webgl"); if (!(o instanceof HTMLElement)) { console.error('Failed to find a valid element with the ID "webgl".'); return } const e = new S(o); e.init(), e.setup(), e.render() }, !1);
