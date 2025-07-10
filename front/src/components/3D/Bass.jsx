import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useThree, useFrame, invalidate } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import ThreeDMode from './ThreeDMode';
import '../../css/3d/Three.css';

function CameraController({ mode }) {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(0.05, 0.8, -2.0), []);
  const viewCartesian = useRef(new THREE.Vector3());
  const prevMode = useRef(mode);

  useEffect(() => {
    viewCartesian.current.copy(camera.position);
  }, [camera]);

  useEffect(() => {
    if (mode === 'view' && prevMode.current !== 'view') {
      camera.position.copy(viewCartesian.current);
      camera.lookAt(target);
      invalidate();
    }
    prevMode.current = mode;
  }, [mode, camera, target]);

  useFrame(() => {
    if (mode === 'play') {
      const playSpherical = new THREE.Spherical(4.7, Math.PI / 2, 0);
      const playPos = new THREE.Vector3()
        .setFromSpherical(playSpherical)
        .add(target);
      camera.position.lerp(playPos, 0.08);
      camera.lookAt(target);
      camera.rotateZ(-Math.PI / 2);
      invalidate();
    }
  });

  return null;
}

export default function ThreeD() {
  const [isMobile2, setIsMobile2] = useState(window.innerWidth <= 800);

  const { nodes } = useGLTF('/3D/Bass_Game.glb');
  const { scene: bassStringScene } = useGLTF('/3D/BassString.glb');
  const { scene: codeNameScene } = useGLTF('/3D/CodeName.glb');

const [width, setWidth] = useState(
  typeof window !== 'undefined' ? window.innerWidth : 1920
);
useEffect(() => {
  const handleResize = () => setWidth(window.innerWidth);
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
  
}, []);

useEffect(() => {
  const handleResize = () => {
    setIsMobile2(window.innerWidth <= 800);
  };

  handleResize();
  window.addEventListener("resize", handleResize);

  return () => {
    window.removeEventListener("resize", handleResize);
  };
}, []);

const isExtraLarge = width > 1550;
const isDesktop = width <= 1409 && width > 1300;
const isMidDesktop = width <= 1300 && width > 1150;
const isLowDesktop = width <= 1150 && width > 1000;
const isNarrowDesktop = width <= 1000 && width > 850; 
const isTablet = width <= 850 && width > 760;
const isMobile = width <= 760 && width > 660;
const isSmallMobile = width <= 660 && width > 550;
const isVerySmallMobile = width <= 550;

const [mode, setMode] = useState('view');
const [playType, setPlayType] = useState('note');
const isPlay = mode === 'play';

const bassScale = isVerySmallMobile
  ? 0.9
  : isSmallMobile
  ? 1.0
  : isMobile
  ? 1.1
  : isTablet
  ? 1.3
  : isNarrowDesktop
  ? 1.33
  : isLowDesktop
  ? 1.37
  : isMidDesktop
  ? 1.42
  : isDesktop
  ? 1.5
  : 1.6;

const bassPosition = isVerySmallMobile
  ? [0, -1.7, 0.4]
  : isSmallMobile
  ? [0, -1.95, 0.65]
  : isMobile
  ? [0, -2.28, 0.7]
  : isTablet
  ? [0, -2.8, 0.5]
  : isNarrowDesktop
  ? [0, -2.92, 0.65] 
  : isLowDesktop
  ? [0, -3.0, 0.82] 
  : isMidDesktop
  ? [0, -3.15, 0.87]  
  : isDesktop
  ? [0, -3.4, 0.8]    
  : [0, -3.7, 0.8];   

const bassRotation = [Math.PI / 20, 0, 0];

const baseCodeScale = 1.182;
const baseCodeRotation = [0, -Math.PI / 2, 0];

const codeScale = isVerySmallMobile
  ? 0.9
  : isSmallMobile
  ? 1.0
  : isMobile
  ? 1.1
  : isTablet
  ? 1.3
  : isNarrowDesktop
  ? 1.32
  : isLowDesktop
  ? 1.37
  : isMidDesktop
  ? 1.42
  : baseCodeScale;

const codePosition = isVerySmallMobile
  ? [0, 0.35, 0.35]
  : isSmallMobile
  ? [0, 0, 0.05]
  : isMobile
  ? [0, -0.24, 0]
  : isTablet
  ? [0, -0.9, -0.2]
  : isNarrowDesktop
  ? [0, -0.93, -0.23]
  : isLowDesktop
  ? [0, -1.05, -0.19]
  : isMidDesktop
  ? [0, -1.13, -0.17]
  : [0, -0.54, -0.17];

  const originalColorsRef = useRef({});
  useEffect(() => {
    bassStringScene.traverse(child => {
      if (child.isMesh && child.material) {
        const matClone = child.material.clone();
        matClone.color.copy(child.material.color);
        child.material = matClone;
        originalColorsRef.current[child.uuid] = matClone.color.clone();
      }
    });
  }, [bassStringScene]);

  const audioCacheRef = useRef({});
  useEffect(() => {
    const cache = {};
    const basePath = playType === 'note' ? '/music/Bass/Note/' : '/music/Bass/Code/';
    for (let s = 1; s <= 4; s++) {
      for (let i = 1; i <= 12; i++) {
        const name = `S${s}_${i}`;
        const audio = new Audio(`${basePath}${name}.mp3`);
        audio.preload = 'auto';
        cache[name] = audio;
      }
    }
    audioCacheRef.current = cache;
  }, [playType]);

  const playString = name => {
    const audio = audioCacheRef.current[name]?.cloneNode();
    if (audio) audio.play().catch(err => console.warn(`Audio play error: ${err}`));
  };

  const highlightMesh = mesh => {
    if (!mesh || !mesh.material) return;
    const origColor = originalColorsRef.current[mesh.uuid];
    mesh.material.color.set('#4F959D');
    invalidate();
    setTimeout(() => {
      if (origColor) mesh.material.color.copy(origColor);
      invalidate();
    }, 500);
  };

  useEffect(() => {
    if (!isPlay) return;
    const keyMap = {
      z: 'S4_1', x: 'S4_2', c: 'S4_3', v: 'S4_4',
      b: 'S4_5', n: 'S4_6', m: 'S4_7', ',': 'S4_8',
      '.': 'S4_9', '/': 'S4_10', a: 'S3_1', s: 'S3_2',
      d: 'S3_3', f: 'S3_4', g: 'S3_5', h: 'S3_6',
      j: 'S3_7', k: 'S3_8', l: 'S3_9', ';': 'S3_10',
      q: 'S2_1', w: 'S2_2', e: 'S2_3', r: 'S2_4',
      t: 'S2_5', y: 'S2_6', u: 'S2_7', i: 'S2_8',
      o: 'S2_9', p: 'S2_10', '[': 'S2_11', ']': 'S2_12',
      '1': 'S1_1', '2': 'S1_2', '3': 'S1_3', '4': 'S1_4',
      '5': 'S1_5', '6': 'S1_6', '7': 'S1_7', '8': 'S1_8',
      '9': 'S1_9', '0': 'S1_10', '-': 'S1_11', '=': 'S1_12'
    };
    const handler = e => {
      const name = keyMap[e.key.toLowerCase()];
      if (name) {
        const mesh = bassStringScene.getObjectByName(name);
        if (mesh) {
          playString(name);
          highlightMesh(mesh);
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isPlay, playType, bassStringScene]);

  return (
    <div className="threed">
      <div className="ui">
        <div className="mode-buttons">
          <ThreeDMode
            currentMode={mode}
            setMode={m => { setMode(m); invalidate(); }}
          />
          {isPlay && (
            <div className="play-type-buttons">
              <button
                className={playType === 'note' ? 'active' : ''}
                onClick={() => setPlayType('note')}
              >
                노트 모드
              </button>
              <button
                className={playType === 'code' ? 'active' : ''}
                onClick={() => setPlayType('code')}
              >
                코드 모드
              </button>
            </div>
          )}
        </div>

        <div className="info-block">
          {mode === 'view' ? (
            <div className="instrument-info">
              <h1>마크 제임즈 MJ-500 재즈 베이스 기타</h1>
              <p>4현, 슬림 넥 & 가벼운 바디</p>
              <p>균형 잡힌 사운드 & 액티브 픽업</p>
              <p>입문자·세컨드 베이스로 추천!</p>
              <p><img src="/3D/images/zig.png"></img></p>
            </div>
          ) : (
            <div className="play-info">
              <h1>{isMobile2 ? "터치로 연주해보세요!" : "마우스 또는 키보드를 눌러 연주해보세요!"}</h1>
              <img
                src="/3D/images/GuitarKey.png"
                className="info-image"
                alt="Guitar Key"
              />
            </div>
          )}
        </div>
      </div>

      <Canvas dpr={isTablet ? 1 : Math.min(window.devicePixelRatio, 1)} frameloop="demand">
        <ambientLight intensity={1} />
        <spotLight
          position={[50, 50, 50]}
          angle={Math.PI / 10}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={400}
          shadow-mapSize-height={400}
        />
        <Environment files="/3D/images/DancingHall.hdr" />
        <OrbitControls enabled={mode === 'view'} minDistance={3} maxDistance={18} />
        <CameraController mode={mode} />

        <group position={bassPosition} rotation={bassRotation} scale={bassScale}>
          {isPlay && (
            <>
              <primitive
                object={bassStringScene}
                scale={1}
                rotation={[0, -Math.PI / 2, 0]}
                onPointerDown={e => {
                  e.stopPropagation();
                  playString(e.object.name);
                  highlightMesh(e.object);
                }}
              />
              {playType === 'code' && (
                <primitive
                  object={codeNameScene}
                  scale={codeScale}
                  rotation={baseCodeRotation}
                  position={codePosition}
                />
              )}
            </>
          )}
          <primitive
            object={nodes.Bass}
            scale={1}
            rotation={[0, -Math.PI / 2, 0]}
          />
        </group>
      </Canvas>
    </div>
  );
}
