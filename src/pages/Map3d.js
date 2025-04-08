import React, { useEffect, useState, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

// Global değişken: son point cloud verisini saklar (stateful render)
let lastPointCloud = { positions: null, colors: null };

/**
 * Base64 kodlu stringi ArrayBuffer'a çevirir.
 */
function base64ToArrayBuffer(base64) {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Gelen point cloud verisini çözüp, x, y, z koordinatları ve varsa rgb bilgilerini içeren Float32Array'ler oluşturur.
 */
function decodePointCloud(pointCloud) {
  const buffer = base64ToArrayBuffer(pointCloud.data);
  const expectedPoints = pointCloud.width * pointCloud.height;

  let xOffset = null, yOffset = null, zOffset = null, rgbOffset = null;
  pointCloud.fields.forEach(field => {
    if (field.name === 'x') xOffset = field.offset;
    else if (field.name === 'y') yOffset = field.offset;
    else if (field.name === 'z') zOffset = field.offset;
    else if (field.name === 'rgb') rgbOffset = field.offset;
  });

  if (xOffset === null || yOffset === null || zOffset === null) {
    console.error("Point cloud verisi x, y veya z alanlarını içermiyor.");
    return { positions: new Float32Array(0), colors: new Float32Array(0) };
  }

  const totalPoints = Math.floor(buffer.byteLength / pointCloud.point_step);
  const pointsToDecode = Math.min(expectedPoints, totalPoints);
  const positions = new Float32Array(pointsToDecode * 3);
  let colors = rgbOffset !== null ? new Float32Array(pointsToDecode * 3) : null;
  const littleEndian = !pointCloud.is_bigendian;
  const dataView = new DataView(buffer);

  for (let i = 0; i < pointsToDecode; i++) {
    const baseOffset = i * pointCloud.point_step;
    positions[i * 3]     = dataView.getFloat32(baseOffset + xOffset, littleEndian);
    positions[i * 3 + 1] = dataView.getFloat32(baseOffset + yOffset, littleEndian);
    positions[i * 3 + 2] = dataView.getFloat32(baseOffset + zOffset, littleEndian);

    if (rgbOffset !== null && colors) {
      if (baseOffset + rgbOffset + 4 <= buffer.byteLength) {
        const rgbFloat = dataView.getFloat32(baseOffset + rgbOffset, littleEndian);
        const rgbBuffer = new ArrayBuffer(4);
        new Float32Array(rgbBuffer)[0] = rgbFloat;
        const rgbInt = new Uint32Array(rgbBuffer)[0];
        const r = (rgbInt >> 16) & 0xFF;
        const g = (rgbInt >> 8) & 0xFF;
        const b = (rgbInt) & 0xFF;
        colors[i * 3]     = r / 255;
        colors[i * 3 + 1] = g / 255;
        colors[i * 3 + 2] = b / 255;
      } else {
        colors[i * 3]     = 1.0;
        colors[i * 3 + 1] = 1.0;
        colors[i * 3 + 2] = 1.0;
      }
    }
  }
  return { positions, colors };
}

/**
 * Opsiyonel yuvarlak doku oluşturur.
 */
function useCircleTexture() {
  return useMemo(() => {
    const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');
    context.fillStyle = 'white';
    context.beginPath();
    context.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    context.fill();
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);
}

/**
 * Gelen pozisyon ve renk verileriyle BufferGeometry oluşturur ve noktaları render eder.
 */
const PointCloud = ({ positions, colors }) => {
  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    if (colors) {
      geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    }
    return geom;
  }, [positions, colors]);

  return (
    <points geometry={geometry}>
      <pointsMaterial
        attach="material"
        size={0.05}
        sizeAttenuation={true}
        vertexColors={!!colors}
        transparent={true}
        alphaTest={0.5}
      />
    </points>
  );
};

/**
 * OrbitControls'u canvas'ın DOM referansı ile bağlar.
 */
function Controls() {
  const { camera, gl } = useThree();
  return <OrbitControls camera={camera} domElement={gl.domElement} />;
}

/**
 * 3D sahneyi oluşturur.
 * ROS2 verisini Three.js koordinat sistemine uyarlamak için -90° X-ekseni rotasyonu uygulanır.
 */
const PointCloudScene = ({ positions, colors }) => {
  return (
    <Canvas camera={{ position: [0, 10, 20], fov: 60 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 20, 10]} />
      <group rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <PointCloud positions={positions} colors={colors} />
      </group>
      <gridHelper args={[50, 50, 0x444444, 0x222222]} frustumCulled={false} />
      <Controls />
    </Canvas>
  );
};

const WebvizPage = () => {
  const [pointCloud, setPointCloud] = useState(lastPointCloud);

  useEffect(() => {
    const fetchPointCloud = async () => {
      try {
        const URL =
        process.env.NODE_ENV === 'production'
          ? undefined
          : `http://${window.location.hostname}:5000/pointcloud`;
        const response = await fetch(URL);
        if (!response.ok) {
          console.error("No point cloud data available.");
          return;
        }
        // Tarayıcı gzip'i otomatik açacaktır
        const data = await response.json();
        const decoded = decodePointCloud(data);
        lastPointCloud = decoded;
        setPointCloud(decoded);
      } catch (error) {
        console.error("Error fetching point cloud:", error);
      }
    };
    // Periyodik fetch: her 5 saniyede bir
    fetchPointCloud();
    const interval = setInterval(fetchPointCloud, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      {pointCloud.positions && pointCloud.positions.length > 0 ? (
        <PointCloudScene positions={pointCloud.positions} colors={pointCloud.colors} />
      ) : (
        <div style={{ textAlign: 'center', paddingTop: '20px' }}>
          Point cloud verisi bekleniyor...
        </div>
      )}
    </div>
  );
};

export default WebvizPage;
