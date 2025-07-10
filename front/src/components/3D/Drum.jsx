import React, { useState, useEffect, useRef, Suspense } from "react";
import { Canvas, useThree, useFrame, invalidate } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import ThreeDMode from "./ThreeDMode";
import "../../css/3d/Three.css";

const instrumentSounds = {
  BassDrum: "/music/Drum/BassDrum.mp3",
  SnareDrum: "/music/Drum/SnareDrum.mp3",
  MidTom: "/music/Drum/MidTom.mp3",
  HighTom: "/music/Drum/HighTom.mp3",
  FloorTom: "/music/Drum/FloorTom.mp3",
  CrashCymbalTop: "/music/Drum/CrashCymbal.mp3",
  RideCymbalTop: "/music/Drum/RideCymbal.mp3",
  HiHatOpen: "/music/Drum/HiHatOpen.mp3",
  HiHatClose: "/music/Drum/HiHatClose.mp3",
};

const soundOffsets = {
  BassDrum: 0,
  SnareDrum: 0,
  MidTom: 0,
  HighTom: 0,
  FloorTom: 0,
  CrashCymbalTop: 0,
  RideCymbalTop: 0,
  HiHatOpen: 0,
  HiHatClose: 0,
};

function CameraController({ isPlayMode }) {
  const { camera } = useThree();
  const lookAt = new THREE.Vector3(0, 0, 0);
  const target = isPlayMode ? new THREE.Vector3(0, 2, 7) : null;
  const initRef = useRef(null);

  useEffect(() => {
    if (!initRef.current) initRef.current = camera.position.clone();
  }, [camera]);

  useFrame(() => {
    if (isPlayMode && target) {
      camera.position.lerp(target, 0.05);
      camera.lookAt(lookAt);
      invalidate();
    }
  });

  useEffect(() => {
    if (!isPlayMode && initRef.current) {
      camera.position.copy(initRef.current);
      camera.lookAt(lookAt);
      invalidate();
    }
  }, [isPlayMode]);

  return null;
}

function DrumNameModel({ visible }) {
  const { scene } = useGLTF("/3D/DrumName.glb");
  return (
    <primitive
      object={scene}
      scale={1.5}
      position={[0, 0, 0]}
      rotation={[0, -Math.PI / 2, 0]}
      visible={visible}
    />
  );
}

export default function ThreeD() {
  const [isMobile2, setIsMobile2] = useState(window.innerWidth <= 800);
  const { nodes } = useGLTF("/3D/Drum_Game.glb");

  const [mode, setMode] = useState("view");
  const [showNames, setShowNames] = useState(true);
  const [hatDown, setHatDown] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const isPlayMode = mode === "play";

  const originals = useRef({});
  const pedalTimer = useRef(null);
  const audioContextRef = useRef(null);
  const audioBufferRef = useRef({});
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);

  useEffect(() => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    audioContextRef.current = ctx;

    Promise.all(
      Object.entries(instrumentSounds).map(([name, url]) =>
        fetch(url)
          .then((res) => res.arrayBuffer())
          .then((buf) => ctx.decodeAudioData(buf))
          .then((decoded) => {
            audioBufferRef.current[name] = decoded;
          }),
      ),
    )
      .then(() => {
        setAudioReady(true);
      })
      .catch((err) => console.error("Audio loading error:", err));
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

  const playInstrument = (name, offset = 0) => {
    if (!audioReady) return;
    const ctx = audioContextRef.current;
    const buffer = audioBufferRef.current[name];
    if (!ctx || !buffer) return;
    if (ctx.state === "suspended") ctx.resume();
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.connect(ctx.destination);
    src.start(ctx.currentTime, offset);
  };

  useEffect(() => {
    if (!nodes) return;
    Object.values(nodes).forEach((o) => {
      if (!o.__rotFixed) {
        o.rotation.y -= Math.PI / 2;
        o.__rotFixed = true;
      }
    });
  }, [nodes]);

  useEffect(() => {
    if (!nodes || Object.keys(originals.current).length) return;
    ["PedalL", "Spring", "HiHatTop", "PedalR", "PedalRB"].forEach((n) => {
      const o = nodes[n];
      if (o)
        originals.current[n] = {
          pos: o.position.clone(),
          rot: o.rotation.clone(),
        };
    });
  }, [nodes]);

  const resetTransform = (name) => {
    const o = nodes[name];
    const ori = originals.current[name];
    if (o && ori) {
      o.position.copy(ori.pos);
      o.rotation.copy(ori.rot);
    }
  };

  const applyDelta = (name, dPos, dRot) => {
    const o = nodes[name];
    const ori = originals.current[name];
    if (o && ori) {
      o.position.copy(ori.pos).add(dPos);
      o.rotation.set(
        ori.rot.x + (dRot.x || 0),
        ori.rot.y + (dRot.y || 0),
        ori.rot.z + (dRot.z || 0),
      );
    }
  };

  const handlePedalL = () => {
    if (!isPlayMode) return;
    const next = !hatDown;
    setHatDown(next);
    if (next) {
      applyDelta("PedalL", new THREE.Vector3(0, -0.015, 0), {});
      applyDelta("Spring", new THREE.Vector3(0, -0.015, 0), {});
      applyDelta("HiHatTop", new THREE.Vector3(0, 0.15, 0), {});
    } else {
      ["PedalL", "Spring", "HiHatTop"].forEach(resetTransform);
    }
    invalidate();
  };

  const handleBassDrum = () => {
    if (!isPlayMode) return;
    ["PedalR", "PedalRB"].forEach((n) =>
      applyDelta(n, new THREE.Vector3(0, -0.02, 0), { x: Math.PI / 12 }),
    );
    invalidate();
    clearTimeout(pedalTimer.current);
    pedalTimer.current = setTimeout(() => {
      ["PedalR", "PedalRB"].forEach(resetTransform);
      invalidate();
    }, 1000);
    playInstrument("BassDrum");
  };

  useEffect(() => {
    if (!isPlayMode) {
      ["PedalL", "Spring", "HiHatTop", "PedalR", "PedalRB"].forEach(
        resetTransform,
      );
      setHatDown(false);
      clearTimeout(pedalTimer.current);
      invalidate();
    }
  }, [isPlayMode]);

  useEffect(() => {
    const keyMap = {
      KeyA: "SnareDrum",
      KeyS: "MidTom",
      KeyD: "HighTom",
      KeyF: "FloorTom",
      KeyG: "BassDrum",
      KeyJ: "CrashCymbalTop",
      KeyK: "RideCymbalTop",
    };
    const handler = (e) => {
      if (!isPlayMode) return;
      if (e.code === "KeyH") {
        const hiName = hatDown ? "HiHatOpen" : "HiHatClose";
        playInstrument(hiName);
        return;
      }
      const inst = keyMap[e.code];
      if (inst) {
        if (inst === "BassDrum") handleBassDrum();
        else playInstrument(inst, soundOffsets[inst]);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isPlayMode, audioReady, hatDown]);

  const groupPos = isPlayMode ? [0, -3, -3.5] : [0, -3, -1.8];
  const groupRot = isPlayMode
    ? [Math.PI / 6, Math.PI, 0]
    : [Math.PI / 20, 0, 0];

  return (
    <div className="threed-wrapper">
      {!audioReady && (
        <div className="audio-loading">
          오디오 로딩 중... 잠시만 기다려주세요.
        </div>
      )}
      <div className="threed">
        <div className="ui">
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
                악기명 {showNames ? "ON" : "OFF"}
              </button>
            )}
          </div>
          <div className="info-block">
            {mode === "view" ? (
              <div className="instrument-info">
                <h1>야마하 라이딘 5기통 드럼 세트</h1>
                <p>입문자부터 중급자까지! 다 갖춘 5기통 구성</p>
                <p>베이스드럼부터 플로어 탐까지 기본 세팅</p>
                <p>글리터 피니쉬로 화려한 비주얼!</p>
                <p>가성비 좋은 드럼 세트!</p>
                <p><img src="/3D/images/zig.png"></img></p>
              </div>
            ) : (
              <div className="play-info">
                <h1>
                  {isMobile2
                    ? "터치로 연주해보세요!"
                    : "마우스 또는 키보드를 눌러 연주해보세요!"}
                </h1>
                <img src="/3D/images/DrumKey.png" className="info-image" />
              </div>
            )}
          </div>
        </div>

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
            key={mode}
            enabled={mode === "view"}
            minDistance={3}
            maxDistance={18}
          />
          <CameraController isPlayMode={isPlayMode} />

          <group position={groupPos} rotation={groupRot}>
            {Object.entries(nodes).map(([rawName, obj]) => {
              let name = rawName;
              if (name.startsWith("Cylinder") && name.includes("108"))
                name = "MidTom";
              else if (name.startsWith("Cylinder") && name.includes("100"))
                name = "HighTom";
              else if (name.startsWith("Cube") && name.includes("030"))
                name = "SnareDrum";
              else if (name.startsWith("Cylinder") && name.includes("091"))
                name = "FloorTom";

              if (name === "HiHatTop") {
                return (
                  <primitive
                    key={rawName}
                    object={obj}
                    scale={1.5}
                    onPointerDown={(e) => {
                      if (!isPlayMode) return;
                      e.stopPropagation();
                      const hiName = hatDown ? "HiHatOpen" : "HiHatClose";
                      const original = e.object.material.color.clone();
                      e.object.material = e.object.material.clone();
                      e.object.material.color.set("#4F959D");
                      playInstrument(hiName, soundOffsets[hiName]);
                      setTimeout(() => {
                        e.object.material.color.copy(original);
                      }, 500);
                    }}
                  />
                );
              }

              if (name === "PedalL") {
                return (
                  <primitive
                    key={name}
                    object={obj}
                    scale={1.5}
                    onPointerDown={(e) => {
                      if (isPlayMode) {
                        e.stopPropagation();
                        handlePedalL();
                      }
                    }}
                  />
                );
              }

              if (name.includes("020")) {
                const meshes = [];
                obj.traverse((c) => {
                  if (c.isMesh) meshes.push(c);
                });
                return (
                  <group
                    key={rawName}
                    position={obj.position}
                    rotation={[0, Math.PI / 100, 0]}
                    scale={[1.5, 1.5, 1.5]}
                  >
                    <primitive object={obj} />
                    {meshes.map((m) => (
                      <primitive
                        key={m.uuid}
                        object={m}
                        onPointerDown={(e) => {
                          if (!isPlayMode) return;
                          e.stopPropagation();
                          const original = m.material.color.clone();
                          m.material = m.material.clone();
                          m.material.color.set("#4F959D");
                          handleBassDrum();
                          setTimeout(() => {
                            m.material.color.copy(original);
                          }, 500);
                        }}
                      />
                    ))}
                  </group>
                );
              }

              if (
                [
                  "SnareDrum",
                  "MidTom",
                  "HighTom",
                  "FloorTom",
                  "CrashCymbalTop",
                  "RideCymbalTop",
                ].includes(name)
              ) {
                return (
                  <primitive
                    key={rawName}
                    object={obj}
                    scale={1.5}
                    onPointerDown={(e) => {
                      if (!isPlayMode) return;
                      e.stopPropagation();
                      const original = e.object.material.color.clone();
                      e.object.material = e.object.material.clone();
                      e.object.material.color.set("#4F959D");
                      playInstrument(name, soundOffsets[name]);
                      setTimeout(() => {
                        e.object.material.color.copy(original);
                      }, 500);
                    }}
                  />
                );
              }

              return (
                <primitive
                  key={rawName}
                  object={obj}
                  scale={1.5}
                  onPointerDown={(e) => {
                    if (!isPlayMode) return;
                    e.stopPropagation();
                    playInstrument(name, soundOffsets[name]);
                  }}
                />
              );
            })}
            <Suspense fallback={null}>
              <DrumNameModel visible={isPlayMode && showNames} />
            </Suspense>
          </group>
        </Canvas>
      </div>
    </div>
  );
}
