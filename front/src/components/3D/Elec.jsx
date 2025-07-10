import React, { useState, useEffect, useRef, useMemo } from "react";
import { Canvas, useThree, useFrame, invalidate } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import ThreeDMode from "./ThreeDMode";
import "../../css/3d/Three.css";

function CameraController({ mode }) {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(0.14, 1.1, -2.3), []);
  const viewCartesian = useRef(new THREE.Vector3());
  const prevMode = useRef(mode);

  useEffect(() => {
    viewCartesian.current.copy(camera.position);
  }, [camera]);

  useEffect(() => {
    if (mode === "view" && prevMode.current !== "view") {
      camera.position.copy(viewCartesian.current);
      camera.lookAt(target);
      invalidate();
    }
    prevMode.current = mode;
  }, [mode, camera, target]);

  useFrame(() => {
    if (mode === "play") {
      const playSpherical = new THREE.Spherical(4.7, Math.PI / 1.9, 0);
      const playPos = new THREE.Vector3()
        .setFromSpherical(playSpherical)
        .add(target);
      camera.position.lerp(playPos, 0.1);
      camera.lookAt(target);
      camera.rotateZ(-Math.PI / 2);
      invalidate();
    }
  });

  return null;
}

export default function ThreeD() {
  const [isMobile2, setIsMobile2] = useState(false);
  const { nodes } = useGLTF("/3D/Elec_Game.glb");
  const { scene: elecStringScene } = useGLTF("/3D/ElecString.glb");
  const { scene: codeNameScene } = useGLTF("/3D/ElecCode.glb");

  // 반응형 브레이크포인트
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1920,
  );
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile2(window.innerWidth <= 800);
    };

    handleResize(); // 초기 렌더 시 체크
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isExtraLarge = width > 1510;
  const isDesktop = width <= 1510 && width > 1280;
  const isMidDesktop = width <= 1280 && width > 1090;
  const isLargeTablet = width <= 1090 && width > 900; // 1090 ~ 901
  const isTabletWide = width <= 900 && width > 800; // 900 ~ 851
  const isTabletNarrow = width <= 800 && width > 700; // 850 ~ 771
  const isMidTablet = width <= 700 && width > 660;
  const isSmallMobile = width <= 660 && width > 550;
  const isVerySmallMobile = width <= 550 && width > 410;
  const isUltraSmallMobile = width <= 410;

  // 반응형 스케일 설정
  const groupScale = isUltraSmallMobile
    ? 0.85
    : isVerySmallMobile
      ? 0.9
      : isSmallMobile
        ? 1.0
        : isMidTablet
          ? 1.1
          : isTabletNarrow
            ? 1.2
            : isTabletWide
              ? 1.25
              : isLargeTablet
                ? 1.35
                : isMidDesktop
                  ? 1.4
                  : isDesktop
                    ? 1.5
                    : 1.6;

  // 반응형 위치 설정
  const groupPosition = isUltraSmallMobile
    ? [0, -1.5, 0.6] // 410 이하
    : isVerySmallMobile
      ? [0, -1.65, 0.64] // 411 ~ 550
      : isSmallMobile
        ? [0, -1.95, 0.8] // 551 ~ 660
        : isMidTablet
          ? [0, -2.25, 0.8] // 661 ~ 770
          : isTabletNarrow
            ? [0, -2.52, 0.75] // 771 ~ 850
            : isTabletWide
              ? [0, -2.68, 0.77] // 851 ~ 900
              : isLargeTablet
                ? [0, -2.94, 0.8] // 901 ~ 1090
                : isMidDesktop
                  ? [0, -3.1, 0.9] // 1091 ~ 1280
                  : isDesktop
                    ? [0, -3.4, 0.9] // 1281 ~ 1510
                    : [0, -3.7, 0.9]; // 1511 이상

  const groupRotation = [Math.PI / 20, 0, 0];
  const modelRotation = [0, -Math.PI / 2, 0];

  const [mode, setMode] = useState("view");
  const [playType, setPlayType] = useState("note");
  const isPlay = mode === "play";

  const originalColorsRef = useRef({});
  useEffect(() => {
    const collectMaterials = (scene) => {
      scene.traverse((child) => {
        if (child.isMesh && child.material) {
          const matClone = child.material.clone();
          matClone.color.copy(child.material.color);
          child.material = matClone;
          originalColorsRef.current[child.uuid] = matClone.color.clone();
        }
      });
    };
    collectMaterials(elecStringScene);
    collectMaterials(codeNameScene);
  }, [elecStringScene, codeNameScene]);

  const audioCacheRef = useRef({});
  useEffect(() => {
    const cache = {};
    const stringPath =
      playType === "note" ? "/music/Elec/Note/" : "/music/Elec/Code/";
    for (let s = 1; s <= 6; s++) {
      for (let i = 1; i <= 12; i++) {
        const name = `S${s}_${i}`;
        const audio = new Audio(`${stringPath}${name}.mp3`);
        audio.preload = "auto";
        cache[name] = audio;
      }
    }
    if (playType === "code") {
      const codeNames = [
        "Ab",
        "Am",
        "Bb",
        "Bdim",
        "C",
        "Dm",
        "E",
        "Em",
        "F",
        "Fm",
        "G",
        "Gm",
      ];
      for (const name of codeNames) {
        const audio = new Audio(`/music/Elec/Code/${name}.mp3`);
        audio.preload = "auto";
        cache[name] = audio;
      }
    }
    audioCacheRef.current = cache;
  }, [playType]);

  const playString = (name) => {
    const audio = audioCacheRef.current[name]?.cloneNode();
    if (audio)
      audio.play().catch((err) => console.warn(`Audio play error: ${err}`));
  };

  const highlightMesh = (mesh) => {
    if (!mesh || !mesh.material) return;
    const origColor = originalColorsRef.current[mesh.uuid];
    mesh.material.color.set("#57B4BA");
    invalidate();
    setTimeout(() => {
      if (origColor) mesh.material.color.copy(origColor);
      invalidate();
    }, 500);
  };

  useEffect(() => {
    if (!isPlay) return;
    const keyMap = {
      z: "S4_1",
      x: "S4_2",
      c: "S4_3",
      v: "S4_4",
      b: "S4_5",
      n: "S4_6",
      m: "S4_7",
      ",": "S4_8",
      ".": "S4_9",
      "/": "S4_10",
      a: "S3_1",
      s: "S3_2",
      d: "S3_3",
      f: "S3_4",
      g: "S3_5",
      h: "S3_6",
      j: "S3_7",
      k: "S3_8",
      l: "S3_9",
      ";": "S3_10",
      q: "S2_1",
      w: "S2_2",
      e: "S2_3",
      r: "S2_4",
      t: "S2_5",
      y: "S2_6",
      u: "S2_7",
      i: "S2_8",
      o: "S2_9",
      p: "S2_10",
      "[": "S2_11",
      "]": "S2_12",
      1: "S1_1",
      2: "S1_2",
      3: "S1_3",
      4: "S1_4",
      5: "S1_5",
      6: "S1_6",
      7: "S1_7",
      8: "S1_8",
      9: "S1_9",
      0: "S1_10",
      "-": "S1_11",
      "=": "S1_12",
    };
    const handler = (e) => {
      const name = keyMap[e.key.toLowerCase()];
      if (name) {
        const mesh = elecStringScene.getObjectByName(name);
        if (mesh) {
          playString(name);
          highlightMesh(mesh);
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isPlay, playType, elecStringScene]);

  return (
    <div className="threed">
      <div className="ui">
        <div className="mode-buttons">
          <ThreeDMode
            currentMode={mode}
            setMode={(m) => {
              setMode(m);
              invalidate();
            }}
          />
          {isPlay && (
            <div className="play-type-buttons">
              <button
                className={playType === "note" ? "active" : ""}
                onClick={() => setPlayType("note")}
              >
                노트 모드
              </button>
              <button
                className={playType === "code" ? "active" : ""}
                onClick={() => setPlayType("code")}
              >
                코드 모드
              </button>
            </div>
          )}
        </div>
        <div className="info-block">
          {mode === "view" ? (
            <div className="instrument-info">
              <h1>고퍼우드 S-classic III</h1>
              <p>고밀도 EPP소재로 가볍고 뛰어난 내구성</p>
              <p>다이나믹 레인지로 넘나드는 다양한 장르!</p>
              <p>입문자·세컨드 일렉으로 추천!</p>
              <p><img src="/3D/images/zig.png"></img></p>
            </div>
          ) : (
            <div className="play-info">
              <h1>
                {isMobile2
                  ? "터치로 연주해보세요!"
                  : "마우스 또는 키보드를 눌러 연주해보세요!"}
              </h1>
              <img src="/3D/images/GuitarKey.png" className="info-image" />
            </div>
          )}
        </div>
      </div>

      <Canvas dpr={Math.min(window.devicePixelRatio, 1)} frameloop="demand">
        <ambientLight intensity={-0.2} />
        <spotLight
          position={[50, 50, 50]}
          angle={Math.PI / 10}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={400}
          shadow-mapSize-height={400}
        />
        <Environment files="/3D/images/DancingHall.hdr" />
        <OrbitControls
          enabled={mode === "view"}
          minDistance={3}
          maxDistance={18}
        />
        <CameraController mode={mode} />

        <group position={groupPosition} rotation={groupRotation}>
          {isPlay && (
            <>
              <primitive
                object={elecStringScene}
                scale={groupScale}
                rotation={modelRotation}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  const mesh = e.object;
                  const name = mesh.name;
                  playString(name);
                  highlightMesh(mesh);
                }}
              />
              {playType === "code" && (
                <primitive
                  object={codeNameScene}
                  scale={groupScale}
                  rotation={modelRotation}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    let group = e.object;
                    while (group.parent && !(group instanceof THREE.Group)) {
                      group = group.parent;
                    }
                    if (group && group.name && group.type === "Group") {
                      playString(group.name);
                      highlightMesh(group);
                    }
                  }}
                />
              )}
            </>
          )}
          <primitive
            object={nodes.Elec}
            scale={groupScale}
            rotation={modelRotation}
          />
        </group>
      </Canvas>
    </div>
  );
}
