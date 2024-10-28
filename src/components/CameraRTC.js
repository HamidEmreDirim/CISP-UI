import React from 'react';
import temp_image from '../assets/img/profile-cover.jpg'

function VideoStream() {
  return (
    <div style={styles.container}> {/* Flex container for side-by-side streams */}
      <div style={styles.streamContainer}>
        <iframe
          src={temp_image}
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="Camera Stream 1"
        />
      </div>
      <div style={styles.streamContainer}>
        <iframe
          src={temp_image}// Second camera URL
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="Camera Stream 2"
        />
      </div>
    </div>
  );
}

// Define inline styles for layout with a fixed height
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: '80%',
    paddingPadding: '50px'       // Set the height of the container
  },
  streamContainer: {
    flex: 1,
    margin: '0 5px',
    height: '100%',        // Each stream takes the full height of the container
  }
};

export default VideoStream;
