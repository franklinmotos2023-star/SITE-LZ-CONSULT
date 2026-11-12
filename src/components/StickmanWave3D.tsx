import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

interface StickmanWave3DProps {
  onSelectCases?: () => void;
  activeStage?: number;
}

/**
 * Three.js Half-Body Waving Stick Figure ("Bonequinho Stick")
 * Appears on the side of the screen (waist-up / meio corpo) waving hello ("dando tchauzinho")
 * with a speech bubble that says: "CASES NO FINAL DA PÁGINA!"
 */
export const StickmanWave3D: React.FC<StickmanWave3DProps> = ({
  onSelectCases,
  activeStage = 0,
}) => {
  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const waveBoostRef = useRef<number>(0);
  const [isHovered, setIsHovered] = useState(false);

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

    const width = 150;
    const height = 190;

    const scene = new THREE.Scene();

    // Camera framing the upper body ("meio corpo") from waist to raised waving hand
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 50);
    camera.position.set(0, 1.35, 5.2);
    camera.lookAt(0, 1.25, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2),
    );
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // 2. Studio Environment Map for crisp specular highlights on the black stick figure
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTexture = pmremGenerator.fromScene(
      new RoomEnvironment(),
      0.04,
    ).texture;
    scene.environment = envTexture;
    pmremGenerator.dispose();

    // 3. Balanced 3-Point Studio Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xd4d4d8, 1.2);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfffaf0, 2.2);
    keyLight.position.set(3, 5, 4);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 1.6);
    rimLight.position.set(-3, 3, -3);
    scene.add(rimLight);

    // 4. PBR Materials (varied roughness/metalness across silhouette parts)
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x0a0a0a,
      roughness: 0.22,
      metalness: 0.15,
    });

    const jointMat = new THREE.MeshStandardMaterial({
      color: 0x1f1f1f,
      roughness: 0.48,
      metalness: 0.35,
    });

    const eyeWhiteMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.1,
      metalness: 0.0,
    });

    const pupilMat = new THREE.MeshStandardMaterial({
      color: 0x000000,
      roughness: 0.05,
      metalness: 0.1,
    });

    // 5. Composite 12-Part Procedural 3D Stick Figure (Waist-Up / Meio Corpo)
    const characterRoot = new THREE.Group();
    // Position character slightly toward the right side of the canvas, leaning playfully inward
    characterRoot.position.set(0.18, 0.0, 0);
    characterRoot.rotation.y = -0.22;
    characterRoot.rotation.z = 0.08;
    scene.add(characterRoot);

    // Waist base ring (clean half-body cut-off collar at bottom)
    const waistRingGeo = new THREE.TorusGeometry(0.2, 0.045, 12, 24);
    waistRingGeo.rotateX(Math.PI / 2);
    const waistRing = new THREE.Mesh(waistRingGeo, jointMat);
    waistRing.position.set(0, 0.12, 0);
    characterRoot.add(waistRing);

    // Upper Torso / Spine
    const torsoGroup = new THREE.Group();
    torsoGroup.position.set(0, 0.12, 0);
    characterRoot.add(torsoGroup);

    const spineGeo = new THREE.CapsuleGeometry(0.13, 0.88, 12, 24);
    const spineMesh = new THREE.Mesh(spineGeo, bodyMat);
    spineMesh.position.set(0, 0.52, 0);
    torsoGroup.add(spineMesh);

    // Chest / Collarbone Bar
    const collarGeo = new THREE.CapsuleGeometry(0.085, 0.62, 10, 20);
    collarGeo.rotateZ(Math.PI / 2);
    const collarMesh = new THREE.Mesh(collarGeo, jointMat);
    collarMesh.position.set(0, 0.92, 0);
    torsoGroup.add(collarMesh);

    // Neck
    const neckGeo = new THREE.CylinderGeometry(0.075, 0.09, 0.24, 16);
    const neckMesh = new THREE.Mesh(neckGeo, jointMat);
    neckMesh.position.set(0, 1.08, 0);
    torsoGroup.add(neckMesh);

    // Head Group
    const headPivot = new THREE.Group();
    headPivot.position.set(0, 1.48, 0);
    torsoGroup.add(headPivot);

    const headGeo = new THREE.SphereGeometry(0.36, 32, 32);
    const headMesh = new THREE.Mesh(headGeo, bodyMat);
    headPivot.add(headMesh);

    // Expressive Eyes Group (for blinking)
    const eyesGroup = new THREE.Group();
    headPivot.add(eyesGroup);

    const eyeGeo = new THREE.SphereGeometry(0.065, 16, 16);
    eyeGeo.scale(1, 1.25, 0.6);

    const leftEye = new THREE.Mesh(eyeGeo, eyeWhiteMat);
    leftEye.position.set(-0.12, 0.06, 0.31);
    eyesGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeWhiteMat);
    rightEye.position.set(0.12, 0.06, 0.31);
    eyesGroup.add(rightEye);

    const pupilGeo = new THREE.SphereGeometry(0.032, 12, 12);
    const leftPupil = new THREE.Mesh(pupilGeo, pupilMat);
    leftPupil.position.set(-0.12, 0.06, 0.35);
    eyesGroup.add(leftPupil);

    const rightPupil = new THREE.Mesh(pupilGeo, pupilMat);
    rightPupil.position.set(0.12, 0.06, 0.35);
    eyesGroup.add(rightPupil);

    // Happy Smile Arc
    const smileGeo = new THREE.TorusGeometry(0.11, 0.022, 10, 24, Math.PI * 0.75);
    const smileMesh = new THREE.Mesh(smileGeo, eyeWhiteMat);
    smileMesh.position.set(0, -0.04, 0.325);
    smileMesh.rotation.z = Math.PI * 1.125;
    headPivot.add(smileMesh);

    // ============================================================
    // LEFT ARM (Waving arm on viewer's left / character's right side)
    // ============================================================
    const waveShoulderPivot = new THREE.Group();
    waveShoulderPivot.position.set(-0.36, 0.92, 0);
    torsoGroup.add(waveShoulderPivot);

    const shoulderSphereGeo = new THREE.SphereGeometry(0.11, 16, 16);
    const leftShoulderBall = new THREE.Mesh(shoulderSphereGeo, jointMat);
    waveShoulderPivot.add(leftShoulderBall);

    const upperArmGeo = new THREE.CapsuleGeometry(0.075, 0.42, 10, 18);
    const waveUpperArm = new THREE.Mesh(upperArmGeo, bodyMat);
    waveUpperArm.position.set(-0.18, 0.16, 0);
    waveUpperArm.rotation.z = Math.PI * 0.32;
    waveShoulderPivot.add(waveUpperArm);

    // Elbow Pivot for energetic waving ("dando tchauzinho")
    const waveElbowPivot = new THREE.Group();
    waveElbowPivot.position.set(-0.36, 0.31, 0);
    waveShoulderPivot.add(waveElbowPivot);

    const elbowBall = new THREE.Mesh(
      new THREE.SphereGeometry(0.085, 16, 16),
      jointMat,
    );
    waveElbowPivot.add(elbowBall);

    const forearmGeo = new THREE.CapsuleGeometry(0.068, 0.42, 10, 18);
    const waveForearm = new THREE.Mesh(forearmGeo, bodyMat);
    waveForearm.position.set(0, 0.24, 0);
    waveElbowPivot.add(waveForearm);

    // Hand + Fingers at top of waving forearm
    const handPivot = new THREE.Group();
    handPivot.position.set(0, 0.5, 0);
    waveElbowPivot.add(handPivot);

    const palmGeo = new THREE.SphereGeometry(0.105, 16, 16);
    palmGeo.scale(1.1, 1.15, 0.65);
    const palmMesh = new THREE.Mesh(palmGeo, bodyMat);
    handPivot.add(palmMesh);

    const fingerGeo = new THREE.CapsuleGeometry(0.024, 0.1, 6, 10);
    [-0.055, 0, 0.055].forEach((fx, i) => {
      const finger = new THREE.Mesh(fingerGeo, bodyMat);
      finger.position.set(fx, 0.11, 0);
      finger.rotation.z = (i - 1) * -0.15;
      handPivot.add(finger);
    });

    const thumb = new THREE.Mesh(fingerGeo, bodyMat);
    thumb.position.set(0.1, 0.02, 0);
    thumb.rotation.z = -0.75;
    handPivot.add(thumb);

    // ============================================================
    // OTHER ARM (Resting casually on hip)
    // ============================================================
    const restShoulderPivot = new THREE.Group();
    restShoulderPivot.position.set(0.36, 0.92, 0);
    torsoGroup.add(restShoulderPivot);

    const rightShoulderBall = new THREE.Mesh(shoulderSphereGeo, jointMat);
    restShoulderPivot.add(rightShoulderBall);

    const restUpperArm = new THREE.Mesh(upperArmGeo, bodyMat);
    restUpperArm.position.set(0.14, -0.18, 0);
    restUpperArm.rotation.z = 0.55;
    restShoulderPivot.add(restUpperArm);

    const restForearm = new THREE.Mesh(forearmGeo, bodyMat);
    restForearm.position.set(0.16, -0.45, 0.08);
    restForearm.rotation.z = -0.48;
    restForearm.rotation.x = -0.25;
    restShoulderPivot.add(restForearm);

    // Pre-warm shaders on hardware WebGL
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

      // Decay interactive wave speed boost smoothly
      waveBoostRef.current = THREE.MathUtils.damp(
        waveBoostRef.current,
        0,
        3,
        delta,
      );

      const waveSpeed = 6.8 + waveBoostRef.current * 6.0;
      const waveAngle = Math.sin(elapsed * waveSpeed) * 0.52;

      // Waving forearm & hand ("dando tchauzinho")
      waveElbowPivot.rotation.z = 0.25 + waveAngle;
      handPivot.rotation.z = Math.sin(elapsed * waveSpeed - 0.6) * 0.28;
      waveShoulderPivot.rotation.z = Math.sin(elapsed * 3.4) * 0.08;

      // Friendly head bob & torso breathing sway
      headPivot.rotation.z = Math.sin(elapsed * 3.4) * 0.09;
      headPivot.rotation.y = 0.15 + Math.cos(elapsed * 2.2) * 0.12;
      torsoGroup.rotation.z = Math.sin(elapsed * 2.5) * 0.04;
      characterRoot.position.y = Math.sin(elapsed * 3.4) * 0.04;

      // Natural eye blink every ~3.8 seconds
      const blinkCycle = elapsed % 3.8;
      const blinkScale =
        blinkCycle > 3.62 && blinkCycle < 3.76 ? 0.08 : 1.0;
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
      waistRingGeo.dispose();
      spineGeo.dispose();
      collarGeo.dispose();
      neckGeo.dispose();
      headGeo.dispose();
      eyeGeo.dispose();
      pupilGeo.dispose();
      smileGeo.dispose();
      shoulderSphereGeo.dispose();
      upperArmGeo.dispose();
      forearmGeo.dispose();
      palmGeo.dispose();
      fingerGeo.dispose();
      bodyMat.dispose();
      jointMat.dispose();
      eyeWhiteMat.dispose();
      pupilMat.dispose();
      renderer.dispose();
    };
  }, []);

  const handleInteraction = () => {
    waveBoostRef.current = 1.5;
    if (onSelectCases) {
      onSelectCases();
    }
  };

  return (
    <div
      onMouseEnter={() => {
        setIsHovered(true);
        waveBoostRef.current = 1.2;
      }}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleInteraction}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleInteraction();
        }
      }}
      aria-label="Bonequinho Stick 3D: Cases no final da página"
      className="fixed right-0 bottom-6 sm:bottom-10 z-30 flex items-center select-none cursor-pointer group"
    >
      {/* Speech Bubble ("Balão") pointing to the waving stickman */}
      <div
        className={`relative mr-[-12px] mb-12 sm:mb-14 bg-white text-black border-2 border-black rounded-2xl px-3.5 py-2.5 shadow-[5px_5px_0px_0px_#000000] transition-transform duration-200 ${
          isHovered ? "-translate-y-1 scale-[1.03]" : ""
        }`}
      >
        <p className="font-display font-black text-[11px] sm:text-xs tracking-tight uppercase leading-tight whitespace-nowrap">
          CASES NO FINAL DA PÁGINA!
        </p>
        <span className="block font-mono text-[9px] text-neutral-500 font-bold mt-0.5 whitespace-nowrap">
          {activeStage === 2 ? "Você chegou nos cases!" : "Clique ou role para ver ↓"}
        </span>

        {/* Speech Bubble Triangle Pointer Tail on the right side */}
        <div
          aria-hidden="true"
          className="absolute top-1/2 -right-2.5 -translate-y-1/2 w-4 h-4 bg-white border-t-2 border-r-2 border-black rotate-45"
        />
      </div>

      {/* Three.js Canvas Mount (Half-body Stickman peeking from the right edge) */}
      <div
        ref={canvasMountRef}
        className="w-[125px] h-[160px] sm:w-[150px] sm:h-[190px] mr-[-10px] pointer-events-none shrink-0"
      />
    </div>
  );
};
