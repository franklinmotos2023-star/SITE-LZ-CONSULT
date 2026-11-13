import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { motion } from "motion/react";

interface StickmanWave3DProps {
  onSelectCases?: () => void;
  activeStage?: number;
}

/**
 * High-Craft 3D Snoopy-Inspired Beagle Character in Three.js
 * - Oriented front-facing ("de frente") with direct eye contact toward the user.
 * - Emerges laterally from the right border of the page showing his upper torso,
 *   collar, front-facing head & snout, symmetrical floppy black ears, and waving paw.
 * - Accompanied by a compact speech bubble ("balão de fala") announcing the Cases at the end of the page.
 * - Only appears in the first section (activeStage === 0) and disappears when scrolling down.
 */
export const StickmanWave3D: React.FC<StickmanWave3DProps> = ({
  onSelectCases,
  activeStage = 0,
}) => {
  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const waveBoostRef = useRef<number>(0);
  const [isHovered, setIsHovered] = useState(false);

  const isVisible = activeStage === 0;

  useEffect(() => {
    const container = canvasMountRef.current;
    if (!container) return;

    // 1. Software WebGL detection per Three.js skill directive
    const isSoftwareGl = (() => {
      const probeCanvas = document.createElement("canvas");
      const gl = probeCanvas.getContext("webgl2");
      if (!gl) return true;
      const ext = gl.getExtension("WEBGL_debug_renderer_info");
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = 195;
    const height = 235;

    const scene = new THREE.Scene();

    // Camera positioned straight in front for direct eye contact with the user
    const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 50);
    camera.position.set(0, 1.32, 5.3);
    camera.lookAt(0.08, 1.24, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2),
    );
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // 2. Studio Environment Reflection Map
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTexture = pmremGenerator.fromScene(
      new RoomEnvironment(),
      0.04,
    ).texture;
    scene.environment = envTexture;
    pmremGenerator.dispose();

    // 3. Studio 3-Point Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xcbd5e1, 1.1);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfffcf5, 2.15);
    keyLight.position.set(-3.2, 4.8, 4.8);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xe2e8f0, 1.75);
    rimLight.position.set(3.2, 3.0, -2.8);
    scene.add(rimLight);

    const bottomBounce = new THREE.DirectionalLight(0xd4d4d8, 0.65);
    bottomBounce.position.set(0, -4, 2.5);
    scene.add(bottomBounce);

    // 4. Sculptural PBR Materials
    const whiteFurMat = new THREE.MeshPhysicalMaterial({
      color: 0xfafaf9,
      roughness: 0.35,
      metalness: 0.02,
      clearcoat: 0.25,
      clearcoatRoughness: 0.35,
      sheen: 0.4,
      sheenColor: new THREE.Color(0xe4e4e7),
    });

    const blackVelvetMat = new THREE.MeshStandardMaterial({
      color: 0x09090b,
      roughness: 0.3,
      metalness: 0.08,
    });

    const glossyNoseMat = new THREE.MeshPhysicalMaterial({
      color: 0x050505,
      roughness: 0.05,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
    });

    const collarMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.28,
      metalness: 0.25,
    });

    const chromeTagMat = new THREE.MeshStandardMaterial({
      color: 0xf4f4f5,
      roughness: 0.12,
      metalness: 0.92,
    });

    const eyeHighlightMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
    });

    // ============================================================
    // 5. FRONT-FACING SNOOPY-INSPIRED 3D BEAGLE MODEL
    // Torso leans in from the right edge of the page while the head
    // faces straight forward ("de frente") with direct eye contact.
    // ============================================================
    const dogRoot = new THREE.Group();
    dogRoot.position.set(0.56, 0.2, 0);
    dogRoot.rotation.z = 0.36; // Torso angles out from the right screen border
    dogRoot.rotation.y = 0.0; // Facing directly toward the user
    scene.add(dogRoot);

    // --- A. UPPER TORSO / CHEST ---
    const torsoGroup = new THREE.Group();
    dogRoot.add(torsoGroup);

    const chestGeo = new THREE.CapsuleGeometry(0.35, 0.66, 20, 32);
    const chestMesh = new THREE.Mesh(chestGeo, whiteFurMat);
    chestMesh.position.set(0, 0.52, 0);
    chestMesh.scale.set(0.96, 1.0, 0.88);
    torsoGroup.add(chestMesh);

    // Snoopy's classic black spot patch on the side of his torso
    const spotGeo = new THREE.SphereGeometry(0.22, 24, 24);
    spotGeo.scale(0.65, 1.15, 0.55);
    const spotMesh = new THREE.Mesh(spotGeo, blackVelvetMat);
    spotMesh.position.set(0.26, 0.55, 0.05);
    spotMesh.rotation.z = -0.15;
    torsoGroup.add(spotMesh);

    // Neck
    const neckGeo = new THREE.CylinderGeometry(0.19, 0.24, 0.26, 24);
    const neckMesh = new THREE.Mesh(neckGeo, whiteFurMat);
    neckMesh.position.set(0, 0.97, 0.02);
    torsoGroup.add(neckMesh);

    // Classic Dog Collar + Front-Facing Chrome Tag
    const collarGeo = new THREE.TorusGeometry(0.225, 0.05, 16, 32);
    collarGeo.rotateX(Math.PI / 2);
    const collarMesh = new THREE.Mesh(collarGeo, collarMat);
    collarMesh.position.set(0, 0.95, 0.02);
    torsoGroup.add(collarMesh);

    const tagGeo = new THREE.CylinderGeometry(0.068, 0.068, 0.024, 20);
    tagGeo.rotateX(Math.PI / 2);
    const tagMesh = new THREE.Mesh(tagGeo, chromeTagMat);
    tagMesh.position.set(0, 0.88, 0.26);
    torsoGroup.add(tagMesh);

    // --- B. HEAD & FRONT-FACING SNOUT (Direct Eye Contact) ---
    const headPivot = new THREE.Group();
    headPivot.position.set(-0.04, 1.38, 0.08);
    // Counter-tilt the head so it stays upright and looks straight into the user's eyes
    headPivot.rotation.z = -0.28;
    torsoGroup.add(headPivot);

    // Rounded cranium dome
    const craniumGeo = new THREE.SphereGeometry(0.42, 32, 32);
    craniumGeo.scale(0.98, 1.02, 0.94);
    const craniumMesh = new THREE.Mesh(craniumGeo, whiteFurMat);
    headPivot.add(craniumMesh);

    // Front-facing Beagle Snout (jutting toward the camera)
    const snoutGroup = new THREE.Group();
    snoutGroup.position.set(0, -0.08, 0.32);
    snoutGroup.rotation.x = 0.05;
    headPivot.add(snoutGroup);

    const snoutBridgeGeo = new THREE.CapsuleGeometry(0.23, 0.26, 20, 32);
    snoutBridgeGeo.rotateX(Math.PI / 2);
    const snoutBridgeMesh = new THREE.Mesh(snoutBridgeGeo, whiteFurMat);
    snoutBridgeMesh.scale.set(1.06, 0.86, 1.0);
    snoutGroup.add(snoutBridgeMesh);

    const snoutTipGeo = new THREE.SphereGeometry(0.24, 28, 28);
    snoutTipGeo.scale(1.08, 0.88, 0.95);
    const snoutTipMesh = new THREE.Mesh(snoutTipGeo, whiteFurMat);
    snoutTipMesh.position.set(0, 0.0, 0.14);
    snoutGroup.add(snoutTipMesh);

    // Glossy Black Oval Nose centered on the tip of the snout
    const noseGeo = new THREE.SphereGeometry(0.11, 24, 24);
    noseGeo.scale(1.22, 0.84, 0.9);
    const noseMesh = new THREE.Mesh(noseGeo, glossyNoseMat);
    noseMesh.position.set(0, 0.05, 0.35);
    snoutGroup.add(noseMesh);

    // Front-facing friendly smile underneath the snout
    const smileGeo = new THREE.TorusGeometry(0.135, 0.016, 10, 24, Math.PI * 0.72);
    const smileMesh = new THREE.Mesh(smileGeo, blackVelvetMat);
    smileMesh.position.set(0, -0.085, 0.24);
    smileMesh.rotation.z = Math.PI * 1.14;
    smileMesh.rotation.x = -0.25;
    snoutGroup.add(smileMesh);

    // --- C. DIRECT EYE CONTACT EYES & BROWS ---
    const eyesGroup = new THREE.Group();
    headPivot.add(eyesGroup);

    const eyeGeo = new THREE.SphereGeometry(0.058, 20, 20);
    eyeGeo.scale(0.92, 1.32, 0.6);

    // Left eye (looking directly at camera)
    const leftEye = new THREE.Mesh(eyeGeo, blackVelvetMat);
    leftEye.position.set(-0.145, 0.13, 0.38);
    eyesGroup.add(leftEye);

    // Right eye (looking directly at camera)
    const rightEye = new THREE.Mesh(eyeGeo, blackVelvetMat);
    rightEye.position.set(0.145, 0.13, 0.38);
    eyesGroup.add(rightEye);

    // Bright white eye catchlights for unmistakable eye contact
    const specGeo = new THREE.SphereGeometry(0.019, 12, 12);
    const leftEyeSpec = new THREE.Mesh(specGeo, eyeHighlightMat);
    leftEyeSpec.position.set(-0.13, 0.155, 0.415);
    eyesGroup.add(leftEyeSpec);

    const rightEyeSpec = new THREE.Mesh(specGeo, eyeHighlightMat);
    rightEyeSpec.position.set(0.16, 0.155, 0.415);
    eyesGroup.add(rightEyeSpec);

    // Symmetrical expressive eyebrows
    const browGeo = new THREE.TorusGeometry(0.068, 0.015, 8, 16, Math.PI * 0.65);
    const leftBrow = new THREE.Mesh(browGeo, blackVelvetMat);
    leftBrow.position.set(-0.15, 0.25, 0.35);
    leftBrow.rotation.z = 0.28;
    headPivot.add(leftBrow);

    const rightBrow = new THREE.Mesh(browGeo, blackVelvetMat);
    rightBrow.position.set(0.15, 0.25, 0.35);
    rightBrow.rotation.z = 0.12;
    headPivot.add(rightBrow);

    // --- D. SYMMETRICAL FLOPPY BLACK BEAGLE EARS ---
    const earGeo = new THREE.CapsuleGeometry(0.135, 0.46, 16, 24);
    earGeo.scale(0.52, 1.0, 0.85);

    const earTipGeo = new THREE.SphereGeometry(0.15, 20, 20);
    earTipGeo.scale(0.55, 1.1, 0.88);

    // Left Ear (viewer's left side of head)
    const leftEarPivot = new THREE.Group();
    leftEarPivot.position.set(-0.37, 0.08, 0.02);
    headPivot.add(leftEarPivot);

    const leftEarMesh = new THREE.Mesh(earGeo, blackVelvetMat);
    leftEarMesh.position.set(-0.05, -0.32, 0.0);
    leftEarMesh.rotation.z = -0.16;
    leftEarPivot.add(leftEarMesh);

    const leftEarTip = new THREE.Mesh(earTipGeo, blackVelvetMat);
    leftEarTip.position.set(-0.08, -0.52, 0.0);
    leftEarPivot.add(leftEarTip);

    // Right Ear (viewer's right side of head)
    const rightEarPivot = new THREE.Group();
    rightEarPivot.position.set(0.37, 0.08, 0.02);
    headPivot.add(rightEarPivot);

    const rightEarMesh = new THREE.Mesh(earGeo, blackVelvetMat);
    rightEarMesh.position.set(0.05, -0.32, 0.0);
    rightEarMesh.rotation.z = 0.16;
    rightEarPivot.add(rightEarMesh);

    const rightEarTip = new THREE.Mesh(earTipGeo, blackVelvetMat);
    rightEarTip.position.set(0.08, -0.52, 0.0);
    rightEarPivot.add(rightEarTip);

    // --- E. WAVING PAW (Raised on viewer's left, waving directly at user) ---
    const waveShoulderPivot = new THREE.Group();
    waveShoulderPivot.position.set(-0.32, 0.78, 0.14);
    torsoGroup.add(waveShoulderPivot);

    const armGeo = new THREE.CapsuleGeometry(0.095, 0.34, 14, 20);
    const upperArmMesh = new THREE.Mesh(armGeo, whiteFurMat);
    upperArmMesh.position.set(-0.18, 0.12, 0.04);
    upperArmMesh.rotation.z = Math.PI * 0.36;
    waveShoulderPivot.add(upperArmMesh);

    const waveElbowPivot = new THREE.Group();
    waveElbowPivot.position.set(-0.34, 0.24, 0.08);
    waveShoulderPivot.add(waveElbowPivot);

    const forearmGeo = new THREE.CapsuleGeometry(0.09, 0.32, 14, 20);
    const forearmMesh = new THREE.Mesh(forearmGeo, whiteFurMat);
    forearmMesh.position.set(0, 0.17, 0);
    waveElbowPivot.add(forearmMesh);

    // Front-facing Waving Paw + 3 Black Toe Marks
    const pawPivot = new THREE.Group();
    pawPivot.position.set(0, 0.38, 0);
    waveElbowPivot.add(pawPivot);

    const pawGeo = new THREE.SphereGeometry(0.13, 20, 20);
    pawGeo.scale(1.12, 1.18, 0.76);
    const pawMesh = new THREE.Mesh(pawGeo, whiteFurMat);
    pawPivot.add(pawMesh);

    const toeMarkGeo = new THREE.CapsuleGeometry(0.012, 0.068, 6, 10);
    [-0.042, 0, 0.042].forEach((tx) => {
      const toeMark = new THREE.Mesh(toeMarkGeo, blackVelvetMat);
      toeMark.position.set(tx, 0.075, 0.092);
      pawPivot.add(toeMark);
    });

    // --- F. SECOND PAW (Resting at the front of the chest) ---
    const restPawGroup = new THREE.Group();
    restPawGroup.position.set(0.18, 0.42, 0.32);
    torsoGroup.add(restPawGroup);

    const restPawMesh = new THREE.Mesh(pawGeo, whiteFurMat);
    restPawMesh.rotation.x = 0.35;
    restPawMesh.rotation.z = -0.15;
    restPawGroup.add(restPawMesh);

    [-0.042, 0, 0.042].forEach((tx) => {
      const toeMark = new THREE.Mesh(toeMarkGeo, blackVelvetMat);
      toeMark.position.set(tx, 0.05, 0.1);
      toeMark.rotation.x = 0.35;
      restPawGroup.add(toeMark);
    });

    // Pre-warm shaders on hardware GPU
    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // 6. Animation Loop (with software-WebGL fenceSync pacing)
    const clock = new THREE.Clock();
    let frameId = 0;
    let isDisposed = false;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl || typeof gl.fenceSync !== "function") {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (isDisposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (isDisposed) return;
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      waveBoostRef.current = THREE.MathUtils.damp(
        waveBoostRef.current,
        0,
        3,
        delta,
      );

      const waveSpeed = 6.4 + waveBoostRef.current * 5.5;
      const waveSwing = Math.sin(elapsed * waveSpeed) * 0.46;

      // Energetic paw wave
      waveElbowPivot.rotation.z = 0.18 + waveSwing;
      pawPivot.rotation.z = Math.sin(elapsed * waveSpeed - 0.5) * 0.24;
      waveShoulderPivot.rotation.z = Math.sin(elapsed * 3.2) * 0.07;

      // Keep head facing straight at the user with gentle friendly nod/tilt
      headPivot.rotation.z = -0.28 + Math.sin(elapsed * 3.2) * 0.06;
      headPivot.rotation.y = Math.sin(elapsed * 2.0) * 0.05;
      headPivot.position.y = 1.38 + Math.sin(elapsed * 3.2) * 0.022;

      // Symmetrical floppy ears swinging softly
      leftEarPivot.rotation.z =
        -0.06 + Math.sin(elapsed * 3.2 - 0.6) * 0.09 + waveSwing * 0.05;
      rightEarPivot.rotation.z =
        0.06 + Math.sin(elapsed * 3.2 - 0.6) * 0.09;

      // Subtle breathing motion from the screen border
      dogRoot.position.x = 0.56 + Math.sin(elapsed * 2.4) * 0.025;

      // Natural eye blink every ~3.6 seconds
      const blinkCycle = elapsed % 3.6;
      const blinkScale =
        blinkCycle > 3.44 && blinkCycle < 3.58 ? 0.08 : 1.0;
      eyesGroup.scale.y = blinkScale;

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    return () => {
      isDisposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      envTexture.dispose();
      chestGeo.dispose();
      spotGeo.dispose();
      neckGeo.dispose();
      collarGeo.dispose();
      tagGeo.dispose();
      craniumGeo.dispose();
      snoutBridgeGeo.dispose();
      snoutTipGeo.dispose();
      noseGeo.dispose();
      smileGeo.dispose();
      eyeGeo.dispose();
      specGeo.dispose();
      browGeo.dispose();
      earGeo.dispose();
      earTipGeo.dispose();
      armGeo.dispose();
      forearmGeo.dispose();
      pawGeo.dispose();
      toeMarkGeo.dispose();
      whiteFurMat.dispose();
      blackVelvetMat.dispose();
      glossyNoseMat.dispose();
      collarMat.dispose();
      chromeTagMat.dispose();
      eyeHighlightMat.dispose();
      renderer.dispose();
    };
  }, []);

  const handleInteraction = () => {
    waveBoostRef.current = 1.6;
    if (onSelectCases) {
      onSelectCases();
    }
  };

  return (
    <motion.div
      initial={{ x: 180, opacity: 0 }}
      animate={{
        x: isVisible ? 0 : 280,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{ pointerEvents: isVisible ? "auto" : "none" }}
      onMouseEnter={() => {
        setIsHovered(true);
        waveBoostRef.current = 1.25;
      }}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleInteraction}
      role="button"
      tabIndex={isVisible ? 0 : -1}
      aria-hidden={!isVisible}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleInteraction();
        }
      }}
      aria-label="Mascote 3D avisando sobre os Cases no final da página"
      className="fixed right-0 bottom-4 sm:bottom-8 z-30 flex items-center select-none cursor-pointer group overflow-hidden pr-0"
    >
      {/* Compact Comic-Style Speech Bubble ("Balão de fala reduzido") */}
      <div
        className={`relative mr-[-14px] mb-12 sm:mb-14 bg-white text-black border-[1.5px] border-black rounded-xl px-2.5 py-1.5 shadow-[3px_3px_0px_0px_#000000] transition-transform duration-200 ${
          isHovered ? "-translate-y-0.5 scale-[1.03]" : ""
        }`}
      >
        <p className="font-display font-black text-[9px] sm:text-[10px] tracking-tight uppercase leading-tight whitespace-nowrap">
          CASES NO FINAL DA PÁGINA!
        </p>
        <span className="block font-mono text-[8px] text-neutral-500 font-semibold mt-0.5 whitespace-nowrap">
          Clique ou role ↓
        </span>

        {/* Compact Speech Bubble Tail pointing to the dog */}
        <div
          aria-hidden="true"
          className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-2.5 h-2.5 bg-white border-t-[1.5px] border-r-[1.5px] border-black rotate-45"
        />
      </div>

      {/* Three.js Canvas: Front-facing 3D Beagle emerging from the right screen border */}
      <div
        ref={canvasMountRef}
        className="w-[160px] h-[190px] sm:w-[195px] sm:h-[235px] mr-[-26px] pointer-events-none shrink-0"
      />
    </motion.div>
  );
};
