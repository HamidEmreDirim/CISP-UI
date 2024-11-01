import React, { useEffect, useRef } from 'react';
import { socket } from "../services/socket"; // Socket nesnesini içe aktar

function VideoStream() {
  const rgbImageRef = useRef(null);
  const thermalImageRef = useRef(null);

  useEffect(() => {
    // 'camera_frame' event'ini dinleyerek gelen RGB görüntüyü güncelle
    socket.on("camera_frame", (data) => {
      if (rgbImageRef.current) {
        rgbImageRef.current.src = data;  // RGB görüntüsünü güncelle
      }
    });

    // 'thermal_camera_frame' event'ini dinleyerek gelen Termal görüntüyü güncelle
    socket.on("thermal_camera_frame", (data) => {
      if (thermalImageRef.current) {
        thermalImageRef.current.src = data;  // Termal görüntüyü güncelle
      }
    });

    // Cleanup: bileşen kapatıldığında event dinleyicilerini kaldır
    return () => {
      socket.off("camera_frame");
      socket.off("thermal_camera_frame");
    };
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.streamContainer}>
        <h2 style={styles.label}>RGB Stream</h2>
        <img ref={rgbImageRef} alt="RGB Camera Stream" style={styles.image} />
      </div>
      <div style={styles.streamContainer}>
        <h2 style={styles.label}>Thermal Stream</h2>
        <img ref={thermalImageRef} alt="Thermal Camera Stream" style={styles.image} />
      </div>
    </div>
  );
}

// Stil tanımları
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: '80%',
    padding: '50px'
  },
  streamContainer: {
    flex: 1,
    margin: '0 5px',
    height: '100%',
    overflow: 'hidden',
    textAlign: 'center'  // Başlıkların ortalanması için
  },
  image: {
    width: '640px',
    height: '480px',
    objectFit: 'cover'
  },
  label: {
    fontSize: '1.5em',
    marginBottom: '10px',
    color: '#333'
  }
};

export default VideoStream;
