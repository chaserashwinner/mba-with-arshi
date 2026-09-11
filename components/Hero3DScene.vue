<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

defineProps<{
  tiltStyle?: Record<string, string>;
}>();

const canvasContainer = ref<HTMLDivElement | null>(null);
const currentState = ref<number>(0);

let animationFrameId: number | null = null;
let intervalId: ReturnType<typeof setInterval> | null = null;
let resizeObserver: ResizeObserver | null = null;

// Three.js instances
let THREE: any = null;
let scene: any = null;
let camera: any = null;
let renderer: any = null;
let characterGroup: any = null;
let leftLegGroup: any = null;
let rightLegGroup: any = null;
let leftFootMesh: any = null;
let rightFootMesh: any = null;
let leftArmGroup: any = null;
let rightArmGroup: any = null;
let headMesh: any = null;
let torsoMesh: any = null;

const isCanvasLoaded = ref(false);

onMounted(async () => {
  // Toggle floating card analytics state every 4.5 seconds
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    intervalId = setInterval(() => {
      currentState.value = (currentState.value + 1) % 2;
    }, 4500);
  }

  // Import Three.js client-side only
  try {
    THREE = await import('three');
    initThreeScene();
  } catch (err) {
    console.warn('Three.js could not be loaded dynamically, falling back to static visual:', err);
  }
});

function initThreeScene() {
  if (!canvasContainer.value || !THREE) return;

  const container = canvasContainer.value;
  const width = container.clientWidth || 540;
  const height = container.clientHeight || 420;

  // 1. Scene Setup
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x130a2a, 0.08);

  // 2. Perspective Camera with Low-Angle Cinematic Framing
  camera = new THREE.PerspectiveCamera(58, width / height, 0.1, 100);
  camera.position.set(0, 1.15, 4.6);
  camera.lookAt(0, 1.05, 0);

  // 3. Renderer Setup
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Clear existing canvas children if any
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  container.appendChild(renderer.domElement);
  isCanvasLoaded.value = true;

  // 4. Studio Lighting System
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
  scene.add(ambientLight);

  // Key directional light (Front-top key light with shadow casting)
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
  keyLight.position.set(4, 8, 6);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 1024;
  keyLight.shadow.mapSize.height = 1024;
  keyLight.shadow.bias = -0.0005;
  scene.add(keyLight);

  // Soft fill light (Cool blue-violet ambient fill)
  const fillLight = new THREE.DirectionalLight(0xa78bfa, 0.9);
  fillLight.position.set(-5, 3, 2);
  scene.add(fillLight);

  // Rim / Silhouette backlight (Vibrant purple accent glow on character edges)
  const rimLight = new THREE.PointLight(0xdb2ecf, 3.5, 12);
  rimLight.position.set(0, 3, -3);
  scene.add(rimLight);

  // Ground plane shadow receiver
  const shadowPlaneGeo = new THREE.PlaneGeometry(16, 16);
  const shadowPlaneMat = new THREE.ShadowMaterial({ opacity: 0.28 });
  const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.y = 0;
  shadowPlane.receiveShadow = true;
  scene.add(shadowPlane);

  // Decorative perspective grid line ground
  const gridHelper = new THREE.GridHelper(16, 24, 0x6224e9, 0x2b145a);
  gridHelper.position.y = 0.001;
  scene.add(gridHelper);

  // 5. Construct Rigged 3D Character Model (High-detail procedural humanoid with shoes)
  characterGroup = new THREE.Group();
  scene.add(characterGroup);

  // PBR Materials using portfolio color palette
  const suitMaterial = new THREE.MeshStandardMaterial({
    color: 0x1f0d47,
    roughness: 0.35,
    metalness: 0.2,
  });

  const shirtMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.2,
    metalness: 0.1,
  });

  const accentMaterial = new THREE.MeshStandardMaterial({
    color: 0x6224e9,
    roughness: 0.2,
    metalness: 0.5,
    emissive: 0x240d5e,
  });

  const shoeUpperMat = new THREE.MeshStandardMaterial({
    color: 0x111116,
    roughness: 0.3,
    metalness: 0.4,
  });

  const shoeSoleMat = new THREE.MeshStandardMaterial({
    color: 0xdb2ecf,
    roughness: 0.2,
    metalness: 0.8,
    emissive: 0x4a0b46,
  });

  const skinMat = new THREE.MeshStandardMaterial({
    color: 0xe5b89a,
    roughness: 0.6,
    metalness: 0.0,
  });

  // Torso / Jacket
  const torsoGeo = new THREE.BoxGeometry(0.7, 0.95, 0.4);
  torsoMesh = new THREE.Mesh(torsoGeo, suitMaterial);
  torsoMesh.position.y = 1.35;
  torsoMesh.castShadow = true;
  characterGroup.add(torsoMesh);

  // Shirt detail
  const shirtGeo = new THREE.BoxGeometry(0.28, 0.8, 0.42);
  const shirtMesh = new THREE.Mesh(shirtGeo, shirtMaterial);
  shirtMesh.position.y = 1.38;
  characterGroup.add(shirtMesh);

  // Head & Hair
  const headGroup = new THREE.Group();
  headGroup.position.y = 2.05;
  
  const headGeo = new THREE.SphereGeometry(0.26, 32, 32);
  headMesh = new THREE.Mesh(headGeo, skinMat);
  headMesh.scale.set(1, 1.15, 1);
  headMesh.castShadow = true;
  headGroup.add(headMesh);

  // Hair styling
  const hairGeo = new THREE.SphereGeometry(0.28, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
  const hairMat = new THREE.MeshStandardMaterial({ color: 0x1a0f2e, roughness: 0.8 });
  const hairMesh = new THREE.Mesh(hairGeo, hairMat);
  hairMesh.position.y = 0.04;
  headGroup.add(hairMesh);

  // Counselor ID Badge pin
  const badgePinGeo = new THREE.BoxGeometry(0.12, 0.16, 0.04);
  const badgePin = new THREE.Mesh(badgePinGeo, accentMaterial);
  badgePin.position.set(0.22, 1.45, 0.22);
  characterGroup.add(badgePin);

  characterGroup.add(headGroup);

  // Left Leg & Shoe Group
  leftLegGroup = new THREE.Group();
  leftLegGroup.position.set(-0.2, 0.9, 0);

  const legGeo = new THREE.CylinderGeometry(0.11, 0.09, 0.85, 16);
  const leftLegMesh = new THREE.Mesh(legGeo, suitMaterial);
  leftLegMesh.position.y = -0.425;
  leftLegMesh.castShadow = true;
  leftLegGroup.add(leftLegMesh);

  // Oversized 3D Shoe (Left)
  const shoeGroupL = new THREE.Group();
  shoeGroupL.position.set(0, -0.85, 0.08);

  const shoeUpperGeo = new THREE.BoxGeometry(0.22, 0.16, 0.45);
  leftFootMesh = new THREE.Mesh(shoeUpperGeo, shoeUpperMat);
  leftFootMesh.position.set(0, 0.08, 0.06);
  leftFootMesh.castShadow = true;
  shoeGroupL.add(leftFootMesh);

  const shoeSoleGeo = new THREE.BoxGeometry(0.24, 0.05, 0.48);
  const leftSoleMesh = new THREE.Mesh(shoeSoleGeo, shoeSoleMat);
  leftSoleMesh.position.set(0, 0.025, 0.06);
  leftSoleMesh.castShadow = true;
  shoeGroupL.add(leftSoleMesh);

  leftLegGroup.add(shoeGroupL);
  characterGroup.add(leftLegGroup);

  // Right Leg & Shoe Group
  rightLegGroup = new THREE.Group();
  rightLegGroup.position.set(0.2, 0.9, 0);

  const rightLegMesh = new THREE.Mesh(legGeo, suitMaterial);
  rightLegMesh.position.y = -0.425;
  rightLegMesh.castShadow = true;
  rightLegGroup.add(rightLegMesh);

  // Oversized 3D Shoe (Right)
  const shoeGroupR = new THREE.Group();
  shoeGroupR.position.set(0, -0.85, 0.08);

  rightFootMesh = new THREE.Mesh(shoeUpperGeo, shoeUpperMat);
  rightFootMesh.position.set(0, 0.08, 0.06);
  rightFootMesh.castShadow = true;
  shoeGroupR.add(rightFootMesh);

  const rightSoleMesh = new THREE.Mesh(shoeSoleGeo, shoeSoleMat);
  rightSoleMesh.position.set(0, 0.025, 0.06);
  rightSoleMesh.castShadow = true;
  shoeGroupR.add(rightSoleMesh);

  rightLegGroup.add(shoeGroupR);
  characterGroup.add(rightLegGroup);

  // Arms
  const armGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.8, 16);
  
  leftArmGroup = new THREE.Group();
  leftArmGroup.position.set(-0.42, 1.7, 0);
  const leftArmMesh = new THREE.Mesh(armGeo, suitMaterial);
  leftArmMesh.position.y = -0.4;
  leftArmMesh.castShadow = true;
  leftArmGroup.add(leftArmMesh);
  characterGroup.add(leftArmGroup);

  rightArmGroup = new THREE.Group();
  rightArmGroup.position.set(0.42, 1.7, 0);
  const rightArmMesh = new THREE.Mesh(armGeo, suitMaterial);
  rightArmMesh.position.y = -0.4;
  rightArmMesh.castShadow = true;
  rightArmGroup.add(rightArmMesh);
  characterGroup.add(rightArmGroup);

  // 6. Animation Loop (7.5-Second Walk-Toward-Camera Cycle)
  const CYCLE_DURATION = 7.5; // seconds
  const clock = new THREE.Clock();

  function animate() {
    animationFrameId = requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();
    const progress = (elapsedTime % CYCLE_DURATION) / CYCLE_DURATION; // 0.0 to 1.0

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      characterGroup.position.set(0, 0, 0.8);
      characterGroup.rotation.y = 0;
      renderer.render(scene, camera);
      return;
    }

    // Timeline phases:
    // Phase 1 (0.0 -> 0.72): Walk forward from background z=-3.2 to foreground z=+1.5
    // Phase 2 (0.72 -> 0.86): Oversized Foreground Foot moment (foot steps right up to camera z=1.6)
    // Phase 3 (0.86 -> 0.96): Face/Pose pause moment & light spin turn toward viewer
    // Phase 4 (0.96 -> 1.0): Recycles smoothly back to background

    let currentZ = -3.2;
    let walkSpeedMultiplier = 12.0;

    if (progress < 0.72) {
      // Smooth linear advance toward camera
      const tNorm = progress / 0.72;
      currentZ = -3.2 + tNorm * 4.7; // -3.2 -> +1.5
    } else if (progress < 0.86) {
      // Hero foreground moment - very close to camera
      const tNorm = (progress - 0.72) / 0.14;
      currentZ = 1.5 + Math.sin(tNorm * Math.PI) * 0.15; // dramatic camera proximity
      walkSpeedMultiplier = 3.0; // slowing down walk into pose
    } else if (progress < 0.96) {
      // Confident Counselor pose moment
      currentZ = 1.5;
      walkSpeedMultiplier = 0.5;
    } else {
      // Recycle fade/reset transition back to start point
      const tNorm = (progress - 0.96) / 0.04;
      currentZ = 1.5 - tNorm * 4.7;
    }

    characterGroup.position.z = currentZ;

    // Walk Cycle Joint Articulation (Legs & Arms stride)
    const strideTime = elapsedTime * walkSpeedMultiplier;
    const legAngle = Math.sin(strideTime) * 0.55;
    const armAngle = Math.sin(strideTime + Math.PI) * 0.45;

    if (progress < 0.86) {
      leftLegGroup.rotation.x = legAngle;
      rightLegGroup.rotation.x = -legAngle;

      leftArmGroup.rotation.x = armAngle;
      rightArmGroup.rotation.x = -armAngle;

      // Slight head bob & hip sway
      characterGroup.position.y = Math.abs(Math.sin(strideTime * 2)) * 0.06;
      characterGroup.rotation.y = Math.sin(strideTime) * 0.04;
      headGroup.rotation.y = -Math.sin(strideTime) * 0.06;
    } else {
      // Pose state: turn slightly to viewer with open arms
      leftLegGroup.rotation.x = THREE.MathUtils.lerp(leftLegGroup.rotation.x, 0.1, 0.1);
      rightLegGroup.rotation.x = THREE.MathUtils.lerp(rightLegGroup.rotation.x, -0.15, 0.1);
      leftArmGroup.rotation.x = THREE.MathUtils.lerp(leftArmGroup.rotation.x, -0.2, 0.1);
      leftArmGroup.rotation.z = THREE.MathUtils.lerp(leftArmGroup.rotation.z, -0.15, 0.1);
      rightArmGroup.rotation.x = THREE.MathUtils.lerp(rightArmGroup.rotation.x, -0.2, 0.1);
      rightArmGroup.rotation.z = THREE.MathUtils.lerp(rightArmGroup.rotation.z, 0.15, 0.1);
      characterGroup.rotation.y = THREE.MathUtils.lerp(characterGroup.rotation.y, -0.1, 0.1);
      characterGroup.position.y = 0;
    }

    // Dynamic perspective camera micro-track
    camera.position.y = 1.15 + Math.sin(elapsedTime * 0.8) * 0.03;
    camera.lookAt(0, 1.05 + Math.sin(elapsedTime * 0.5) * 0.02, currentZ * 0.2);

    renderer.render(scene, camera);
  }

  animate();

  // Handle Container Resizing
  resizeObserver = new ResizeObserver(() => {
    if (!canvasContainer.value || !renderer || !camera) return;
    const w = canvasContainer.value.clientWidth;
    const h = canvasContainer.value.clientHeight;
    if (w === 0 || h === 0) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });

  resizeObserver.observe(container);
}

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  if (resizeObserver) resizeObserver.disconnect();
  if (renderer && renderer.domElement) {
    renderer.dispose();
  }
});
</script>

<template>
  <div class="hero-3d-visual-shell" :style="tiltStyle">
    <!-- Atmospheric Radial Glows & Background Geometry -->
    <div class="bg-glow-radial"></div>
    <div class="bg-arc arc-outer"></div>
    <div class="bg-arc arc-inner"></div>

    <!-- WebGL 3D Walk-Toward-Camera Canvas Container -->
    <div class="webgl-stage-card">
      <div ref="canvasContainer" class="webgl-canvas-container"></div>
      
      <!-- Fallback / Loading Overlay before WebGL loads -->
      <div v-if="!isCanvasLoaded" class="webgl-fallback-portrait">
        <img 
          src="/mentors/arshi-800.png" 
          alt="Arshi Khan — Senior MBA Counselor" 
          class="portrait-img"
        />
      </div>

      <div class="portrait-gradient-overlay"></div>

      <!-- Counselor Verification Badge -->
      <div class="counsellor-badge">
        <span class="badge-dot"></span>
        <div class="badge-text">
          <strong>ARSHI KHAN</strong>
          <small>3D PERSPECTIVE • 10+ YRS COUNSELING</small>
        </div>
      </div>

      <!-- Brand Stamp Tag -->
      <div class="brand-stamp">
        <span>EXPERT COUNSELLING</span>
        <strong>MBA WITH ARSHI</strong>
      </div>
    </div>

    <!-- Dual-State Morphing Analytics Card -->
    <div class="morph-analytics-card">
      <transition name="state-fade" mode="out-in">
        <!-- State 0: Shortlist & Cutoffs Mode -->
        <div v-if="currentState === 0" class="card-state" key="state-0">
          <div class="state-header">
            <span class="state-icon">📊</span>
            <div>
              <small>PROFILE MATCHING</small>
              <h4>CAT & XAT Cutoff Shortlists</h4>
            </div>
          </div>
          <div class="state-metrics">
            <span class="metric-pill">85%+ Percentile</span>
            <span class="metric-pill highlighted">Top 15 B-Schools</span>
          </div>
        </div>

        <!-- State 1: Fees vs ROI Placement Mode -->
        <div v-else class="card-state" key="state-1">
          <div class="state-header">
            <span class="state-icon">💡</span>
            <div>
              <small>REAL ROI ANALYSIS</small>
              <h4>Fees vs Placement Package</h4>
            </div>
          </div>
          <div class="state-metrics">
            <span class="metric-pill highlighted">3.5x Average ROI</span>
            <span class="metric-pill">Verified Data</span>
          </div>
        </div>
      </transition>
    </div>

    <!-- Floating Info Cards (Preserved from Reference) -->
    <div class="floating-note note-top">
      <span>01</span>
      <p><strong>Shortlist</strong> by your profile</p>
    </div>

    <div class="floating-note note-bottom">
      <span>02</span>
      <p><strong>Compare</strong> fees and ROI</p>
    </div>
  </div>
</template>

<style scoped>
.hero-3d-visual-shell {
  width: min(620px, 100%);
  min-height: 480px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  isolation: isolate;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform;
}

/* Background Atmosphere & Arcs */
.bg-glow-radial {
  position: absolute;
  width: 520px;
  height: 520px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(219, 46, 207, 0.18), rgba(98, 36, 233, 0.09) 55%, transparent 75%);
  z-index: 1;
  pointer-events: none;
}

.bg-arc {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(98, 36, 233, 0.16);
  pointer-events: none;
  z-index: 1;
}

.arc-outer {
  width: 480px;
  height: 480px;
  animation: arcPulse 8s ease-in-out infinite alternate;
}

.arc-inner {
  width: 350px;
  height: 350px;
  border-style: dashed;
  animation: arcRotate 30s linear infinite;
}

@keyframes arcPulse {
  0% { transform: scale(0.97); opacity: 0.7; }
  100% { transform: scale(1.02); opacity: 1; }
}

@keyframes arcRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Main WebGL Stage Card */
.webgl-stage-card {
  width: min(540px, 100%);
  height: 420px;
  position: relative;
  z-index: 2;
  border: 9px solid white;
  border-radius: 28px 28px 10px 28px;
  background: linear-gradient(135deg, #130a2a 0%, #25114a 60%, #4c1d95 100%);
  box-shadow: 0 28px 80px rgba(32, 17, 70, 0.25);
  overflow: hidden;
  transform: rotate(1.2deg);
  transition: transform 0.3s ease;
}

.webgl-stage-card:hover {
  transform: rotate(0deg) scale(1.01);
}

.webgl-canvas-container {
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
  z-index: 1;
}

.webgl-fallback-portrait {
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
  z-index: 0;
}

.portrait-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 20%;
  filter: contrast(1.03) brightness(1.02);
}

.portrait-gradient-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 45%, rgba(13, 6, 30, 0.85) 100%);
  pointer-events: none;
  z-index: 2;
}

/* Counselor Verification Badge */
.counsellor-badge {
  position: absolute;
  left: 20px;
  bottom: 20px;
  z-index: 3;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.18);
}

.badge-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.25);
  animation: liveDotPulse 2s infinite;
}

@keyframes liveDotPulse {
  0% { transform: scale(0.95); opacity: 0.8; }
  50% { transform: scale(1.15); opacity: 1; }
  100% { transform: scale(0.95); opacity: 0.8; }
}

.badge-text {
  display: flex;
  flex-direction: column;
}

.badge-text strong {
  font-size: 0.88rem;
  letter-spacing: -0.01em;
  color: var(--ink);
}

.badge-text small {
  color: var(--violet);
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

/* Brand Stamp */
.brand-stamp {
  position: absolute;
  right: 20px;
  top: 20px;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  color: white;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
}

.brand-stamp span {
  color: var(--acid);
  font-size: 0.62rem;
  font-weight: 850;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.brand-stamp strong {
  font-size: 0.95rem;
  letter-spacing: -0.01em;
}

/* Dual-State Morphing Analytics Card */
.morph-analytics-card {
  position: absolute;
  bottom: -20px;
  right: 10px;
  z-index: 4;
  width: 310px;
  padding: 16px 20px;
  border-radius: 18px;
  background: var(--violet-dark);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 16px 40px rgba(32, 17, 70, 0.28);
}

.card-state {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.state-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.state-icon {
  font-size: 1.4rem;
}

.state-header small {
  color: var(--acid);
  font-size: 0.62rem;
  font-weight: 850;
  letter-spacing: 0.1em;
}

.state-header h4 {
  margin: 2px 0 0;
  font-size: 0.94rem;
  letter-spacing: -0.01em;
  color: white;
}

.state-metrics {
  display: flex;
  gap: 8px;
}

.metric-pill {
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  color: #e2d8f5;
  font-size: 0.68rem;
  font-weight: 750;
}

.metric-pill.highlighted {
  background: var(--acid);
  color: var(--ink);
  font-weight: 850;
}

/* Transitions for morph card states */
.state-fade-enter-active,
.state-fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.state-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.state-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Floating Info Cards (Preserved) */
.floating-note {
  width: 195px;
  padding: 13px 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  position: absolute;
  z-index: 5;
  border: 1px solid rgba(255, 255, 255, 0.74);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  box-shadow: 0 12px 30px rgba(31, 16, 65, 0.13);
  transition: transform 0.3s ease;
}

.floating-note:hover {
  transform: translateY(-3px);
}

.floating-note > span {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  flex: none;
  border-radius: 99px;
  color: white;
  background: var(--violet);
  font-size: 0.67rem;
  font-weight: 900;
}

.floating-note p {
  margin: 0;
  color: var(--muted);
  font-size: 0.72rem;
  line-height: 1.35;
}

.floating-note strong {
  color: var(--ink);
  font-size: 0.78rem;
}

.note-top {
  top: 15px;
  right: -10px;
  animation: floatTop 4s ease-in-out infinite alternate;
}

.note-bottom {
  top: 130px;
  left: -20px;
  animation: floatBottom 4.5s ease-in-out infinite alternate-reverse;
}

@keyframes floatTop {
  0% { transform: translateY(0); }
  100% { transform: translateY(-6px); }
}

@keyframes floatBottom {
  0% { transform: translateY(0); }
  100% { transform: translateY(6px); }
}

/* Accessibility & Mobile Responsive */
@media (prefers-reduced-motion: reduce) {
  .arc-outer, .arc-inner, .note-top, .note-bottom, .webgl-stage-card {
    animation: none !important;
    transition: none !important;
  }
}

@media (max-width: 1120px) {
  .hero-3d-visual-shell {
    min-height: 420px;
  }
  .webgl-stage-card {
    height: 360px;
  }
}

@media (max-width: 760px) {
  .hero-3d-visual-shell {
    min-height: 320px;
  }
  .webgl-stage-card {
    height: 300px;
  }
  .morph-analytics-card {
    width: 260px;
    bottom: -15px;
    right: 0;
    padding: 12px 14px;
  }
  .floating-note {
    display: none;
  }
}
</style>
