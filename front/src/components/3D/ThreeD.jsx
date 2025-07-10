import React, { useState, useEffect, useRef, Suspense } from "react";
import { Canvas, useThree, useFrame, invalidate } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import ThreeDMode from "./ThreeDMode";
import "../../css/3d/Three.css";

/************
 * CAMERA  *
 ***********/
function CameraController({ isPlayMode }) {
  const { camera } = useThree();
  const targetPosition = isPlayMode ? new THREE.Vector3(0, 1, 5) : null;
  const lookAtTarget = new THREE.Vector3(0, 0, 0);

  useFrame(() => {
    if (isPlayMode && targetPosition) {
      camera.position.lerp(targetPosition, 0.05);
      camera.lookAt(lookAtTarget);
      invalidate();
    }
  });
  return null;
}

/*******************
 * TEXT MESH LAYER *
 *******************/
function NumberNameModel({ visible }) {
  const { scene } = useGLTF("/3D/numberName.glb");
  return (
    <primitive
      object={scene}
      scale={1.5}
      position={[0, 0, 0]}
      rotation={[0, Math.PI / -2, 0]}
      visible={visible}
    />
  );
}

/*****************
 * MAIN 3D VIEW  *
 *****************/
export default function ThreeD() {
  const [isMobile2, setIsMobile2] = useState(false);
  /* === GLTF LOAD === */
  const { nodes } = useGLTF("/3D/Piano_game.glb");

  /* === STATE === */
  const [mode, setMode] = useState("view"); // 'view' | 'play'
  const [showNames, setShowNames] = useState(true); // 계이름 표시 여부
  const isPlayMode = mode === "play";

  /* === REFS === */
  const keyPositionsRef = useRef(Array(24).fill([0, 0, 0]));
  const [, forceRender] = useState(0); // 강제 렌더링 트리거
  const audioCacheRef = useRef({}); // 오디오 캐시
  const modeRef = useRef(mode); // 최신 mode 값을 유지하기 위한 ref
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);

  /* === CONSTANTS === */
  const blackKeyIndexes = [14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
  const keyMap = {
    C: [0, "C.mp3"],
    C2: [1, "C2.mp3"],
    D: [2, "D.mp3"],
    D2: [3, "D2.mp3"],
    E: [4, "E.mp3"],
    E2: [5, "E2.mp3"],
    F: [6, "F.mp3"],
    F2: [7, "F2.mp3"],
    G: [8, "G.mp3"],
    G2: [9, "G2.mp3"],
    A: [10, "A.mp3"],
    A2: [11, "A2.mp3"],
    B: [12, "B.mp3"],
    B2: [13, "B2.mp3"],
    Csharp: [14, "Csharp.mp3", -0.05],
    Dsharp: [15, "Dsharp.mp3", -0.05],
    Fsharp: [16, "Fsharp.mp3", -0.05],
    Gsharp: [17, "Gsharp.mp3", -0.05],
    Asharp: [18, "Asharp.mp3", -0.05],
    Csharp2: [19, "Csharp2.mp3", -0.05],
    Dsharp2: [20, "Dsharp2.mp3", -0.05],
    Fsharp2: [21, "Fsharp2.mp3", -0.05],
    Gsharp2: [22, "Gsharp2.mp3", -0.05],
    Asharp2: [23, "Asharp2.mp3", -0.05],
  };

  /* === AUDIO CACHE === */
  useEffect(() => {
    const cache = {};
    Object.values(keyMap).forEach(([_, file]) => {
      const audio = new Audio(`/music/Piano/${file}`);
      audio.preload = "auto";
      cache[file] = audio;
    });
    audioCacheRef.current = cache;
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

  /* === MODE REF UPDATE === */
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  /* === INITIAL KEY COLOR BY MODE === */
  useEffect(() => {
    if (!nodes) return;
    Object.entries(nodes).forEach(([key, object]) => {
      const idx = keyMap[key]?.[0];
      if (idx !== undefined && !blackKeyIndexes.includes(idx)) {
        object.traverse((child) => {
          if (child.isMesh && child.material?.color) {
            child.material.color.set(isPlayMode ? "#8A8A8A" : "#FCFEFD");
          }
        });
      }
    });
    invalidate();
  }, [mode, nodes]);

  /*************************
   * NOTE PLAY & ANIMATION *
   *************************/
  const playNote = (index, file, offset = -0.1, object = null) => {
    /* 위치(깊이) 애니메이션 */
    keyPositionsRef.current[index] = [0, offset, 0];
    forceRender((x) => x + 1);
    invalidate();

    /* 사운드 */
    const audio = audioCacheRef.current[file]?.cloneNode();
    if (audio) {
      audio.play();
      setTimeout(() => {
        keyPositionsRef.current[index] = [0, 0, 0];
        forceRender((x) => x + 1);
        invalidate();
        audio.pause();
        audio.currentTime = 0;
      }, 650);
    }

    /* 컬러 변환 (눌렀을 때 진한 회색, 이후 연주 모드면 중간 회색으로 복원) */
    if (!blackKeyIndexes.includes(index) && object) {
      object.traverse((child) => {
        if (child.isMesh && child.material?.color) {
          child.material.color.set("#555");
        }
      });
      invalidate();
      setTimeout(() => {
        object.traverse((child) => {
          if (child.isMesh && child.material?.color) {
            // 연주모드일 땐 #8A8A8A, 그 외 모드엔 #FCFEFD 복원
            const restore = modeRef.current === "play" ? "#8A8A8A" : "#FCFEFD";
            child.material.color.set(restore);
          }
        });
        invalidate();
      }, 500);
    }
  };

  /********************
   * MOUSE INTERACTION*
   ********************/
  const handleMouseClick = (key) => {
    const data = keyMap[key];
    const obj = nodes[key];
    if (!data || !obj) return;
    const [index, file, offset = -0.1] = data;
    playNote(index, file, offset, obj);
  };

  const handlePointerDown = (e, key) => {
    e.stopPropagation();
    if (!isPlayMode) return;
    handleMouseClick(key);
  };

  /*******************
   * KEYBOARD INPUT  *
   *******************/
  useEffect(() => {
    const keyboardMap = {
      a: "C",
      q: "C2",
      s: "D",
      w: "D2",
      d: "E",
      e: "E2",
      f: "F",
      r: "F2",
      g: "G",
      t: "G2",
      h: "A",
      y: "A2",
      j: "B",
      u: "B2",
      1: "Csharp",
      2: "Dsharp",
      3: "Fsharp",
      4: "Gsharp",
      5: "Asharp",
      6: "Csharp2",
      7: "Dsharp2",
      8: "Fsharp2",
      9: "Gsharp2",
      0: "Asharp2",
    };

    const down = (e) => {
      if (!isPlayMode || e.repeat) return;
      const mapKey = keyboardMap[e.key.toLowerCase()];
      if (!mapKey) return;
      const d = keyMap[mapKey];
      const obj = nodes[mapKey];
      if (d && obj) {
        const [idx, file, off = -0.1] = d;
        playNote(idx, file, off, obj);
      }
    };

    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, [isPlayMode, nodes]);

  /***********
   * RENDER  *
   ***********/
  return (
    <div className="threed">
      {/* === UI LAYER === */}
      <div className="ui">
        {/* 모드 전환 & 표시 토글 */}
        <div className="mode-buttons">
          <ThreeDMode
            setMode={(m) => {
              setMode(m);
              invalidate();
            }}
            currentMode={mode}
          />
          {isPlayMode && (
            <button
              className={showNames ? "active" : ""}
              onClick={() => {
                setShowNames((p) => !p);
                invalidate();
              }}
            >
              계이름 {showNames ? "ON" : "OFF"}
            </button>
          )}
        </div>
        {/* 정보 블록 */}
        <div className="info-block">
          {mode === "view" && (
            <div className="instrument-info">
              <h1>삼익 디지털피아노 N3 88건반 해머액션</h1>
              <p>가격대비 놀라운 해머 액션의 터치감</p>
              <p>170년 전통의 명품 자일러 그랜드 피아노 사운드!</p>
              <p>전연령층이 사용 가능한 삼익 스테이지 피아노 N3</p>
              <p><img src="/3D/images/zig.png"></img></p>
            </div>
          )}
          {isPlayMode && (
            <div className="play-info">
              <h1>
                {isMobile2
                  ? "터치로 연주해보세요!"
                  : "마우스 또는 키보드를 눌러 연주해보세요!"}
              </h1>
              <img src="/3D/images/PianoKey.png" className="info-image" />
            </div>
          )}
        </div>
      </div>

      {/* === 3D CANVAS === */}
      <Canvas
        dpr={isMobile ? 1 : Math.min(window.devicePixelRatio, 1.5)}
        frameloop="demand"
      >
        <ambientLight intensity={1} />
        <spotLight
          position={[50, 50, 50]}
          angle={Math.PI / 10}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={512}
          shadow-mapSize-height={512}
        />
        <Environment files="/3D/images/DancingHall.hdr" />
        <OrbitControls
          enabled={mode === "view"}
          minDistance={7}
          maxDistance={18}
        />
        <CameraController isPlayMode={mode !== "view"} />

        {/* 피아노 & 키 */}
        <group position={[0, -4, -3]} rotation={[Math.PI / 4, 0, 0]}>
          <primitive
            object={nodes.Piano}
            scale={1.5}
            rotation={[0, Math.PI / -2, 0]}
          />
          {Object.entries(nodes).map(([key, obj]) => {
            if (key === "Piano") return null;
            const idx = keyMap[key]?.[0];
            const pos =
              idx !== undefined ? keyPositionsRef.current[idx] : [0, 0, 0];
            return (
              <primitive
                key={key}
                object={obj}
                scale={1.5}
                rotation={[0, Math.PI / -2, 0]}
                position={pos}
                onPointerDown={(e) => handlePointerDown(e, key)}
              />
            );
          })}
          <Suspense fallback={null}>
            <NumberNameModel visible={isPlayMode && showNames} />
          </Suspense>
        </group>
      </Canvas>
    </div>
  );
}
