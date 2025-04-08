import React, { useEffect, useRef } from 'react';
import { socket } from "../services/socket"; // Socket nesnesini içe aktar

function VideoStream() {
  const rgbImageRef = useRef(null);
  const thermalImageRef = useRef(null);

  useEffect(() => {
    // RGB stream (base64 string bekliyoruz)
    socket.on("camera_frame", (base64Image) => {
      if (rgbImageRef.current) {
        // base64Image örn: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ..."
        rgbImageRef.current.src = base64Image;
      }
    });

    // Termal stream (base64 string bekliyoruz)
    socket.on("thermal_camera_frame", (base64Image) => {
      if (thermalImageRef.current) {
        thermalImageRef.current.src = base64Image;
      }
    });

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
    textAlign: 'center'
  },
  image: {
    width: '800px',              // Görüntü genişliğini büyülttük
    height: '600px',             // Görüntü yüksekliğini büyülttük
    objectFit: 'cover',
    border: '2px solid #ccc',    // Çok göze batmayan gri bir border ekledik
    borderRadius: '4px'          // Hafif köşe yuvarlaması (isteğe bağlı)
  },
  label: {
    fontSize: '1.5em',
    marginBottom: '10px',
    color: '#333'
  }
};

export default VideoStream;
