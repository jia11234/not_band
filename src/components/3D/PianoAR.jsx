import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default function PianoAR() {
  const containerRef = useRef(null);
  const audioCacheRef = useRef({});
  const modelRef = useRef();
  const anchorRef = useRef();

  const blackKeyIndexes = [14,15,16,17,18,19,20,21,22,23];
  const keyMap = {
    /* ...same keyMap as before... */
  };

  // preload audio
  useEffect(() => {
    const cache = {};
    Object.values(keyMap).forEach(([_, file]) => {
      const audio = new Audio(`/music/Piano/${file}`);
      audio.preload = 'auto';
      cache[file] = audio;
    });
    audioCacheRef.current = cache;
  }, []);

  useEffect(() => {
    let mindarThree;
    let isDragging = false;
    let lastX = 0, lastY = 0;

    const startAR = async () => {
      mindarThree = new window.MINDAR.IMAGE.MindARThree({
        container: containerRef.current,
        imageTargetSrc: "/3D/images/Piano.mind",
      });
      const { renderer, scene, camera } = mindarThree;

      // lights
      scene.add(new THREE.AmbientLight(0xffffff, 2));
      const dl = new THREE.DirectionalLight(0xffffff, 1);
      dl.position.set(1,1,1);
      scene.add(dl);

      // load model
      const glb = await new GLTFLoader().loadAsync('/3D/Piano_game.glb');
      const model = glb.scene;
      model.scale.set(0.4, 0.4, 0.4);
      model.rotation.set(0, Math.PI, 0);
      model.traverse(c => {
        if (c.isMesh && c.material.color) {
          c.userData.originalColor = c.material.color.getHex();
        }
      });
      modelRef.current = model;

      // anchor: clear & add on each found
      const anchor = mindarThree.addAnchor(0);
      anchorRef.current = anchor;
      anchor.onTargetFound = () => {
        anchor.group.clear();
        anchor.group.add(model);
      };
      anchor.onTargetLost = () => {
        anchor.group.clear();
      };

      // prevent scrolling/selection
      document.body.style.overflow = 'hidden';
      const container = containerRef.current;
      container.style.touchAction = 'none';
      container.style.userSelect = 'none';

      const playNote = (idx, file, obj) => {
        const audio = audioCacheRef.current[file]?.cloneNode();
        if (audio) {
          audio.play();
          setTimeout(() => { audio.pause(); audio.currentTime = 0; }, 650);
        }
        if (!blackKeyIndexes.includes(idx) && obj) {
          obj.traverse(c => c.isMesh && c.material.color && c.material.color.set('#555'));
          setTimeout(() => {
            obj.traverse(c => c.isMesh && c.material.color && c.material.color.set(c.userData.originalColor));
          }, 500);
        }
      };

      const canvas = renderer.domElement;

      container.addEventListener('pointerdown', e => {
        e.preventDefault();
        isDragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
        e.target.setPointerCapture(e.pointerId);
      }, { passive: false });

      container.addEventListener('pointermove', e => {
        if (!isDragging) return;
        e.preventDefault();
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        lastX = e.clientX;
        lastY = e.clientY;
        // rotate around Y (horizontal drag) and X (vertical drag)
        modelRef.current.rotation.y += dx * 0.005;
        modelRef.current.rotation.x += dy * 0.005;
      }, { passive: false });

      container.addEventListener('pointerup', e => {
        e.preventDefault();
        e.target.releasePointerCapture(e.pointerId);
        const wasDrag = isDragging;
        isDragging = false;
        if (!wasDrag) {
          const mouse = new THREE.Vector2(
            (e.clientX / canvas.clientWidth) * 2 - 1,
            -(e.clientY / canvas.clientHeight) * 2 + 1
          );
          const ray = new THREE.Raycaster();
          ray.setFromCamera(mouse, camera);
          const hits = ray.intersectObjects(modelRef.current.children, true);
          if (hits.length) {
            const obj = hits[0].object;
            const data = keyMap[obj.name];
            if (data) playNote(data[0], data[1], modelRef.current.getObjectByName(obj.name));
          }
        }
      }, { passive: false });

      await mindarThree.start();
      renderer.setAnimationLoop(() => renderer.render(scene, camera));
    };

    startAR();
    return () => {
      if (anchorRef.current) anchorRef.current.group.clear();
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <p style={{
        position: 'absolute',
        top: 20,
        left: 20,
        color: '#fff',
        background: 'rgba(0,0,0,0.5)',
        padding: '10px',
        zIndex: 1
      }}>
        마커를 비춰서 AR을 시작하세요!
      </p>
    </div>
  );
}
