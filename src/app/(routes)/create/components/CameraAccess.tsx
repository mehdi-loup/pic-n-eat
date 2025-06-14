import { Camera } from 'lucide-react';
import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface CameraAccessProps {
  onImageCapture: (file: File) => void;
}

const CameraAccess: React.FC<CameraAccessProps> = ({ onImageCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setHasPermission(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setHasPermission(false);
      // Handle denial or other errors
    } finally {
      setHasPermission(true);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) {
        track.stop();
      }
      streamRef.current = null;
    }
  }, []);

  const takePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'camera_photo.png', { type: 'image/png' });
            onImageCapture(file);
            stopCamera(); // Stop camera after taking photo
          }
        }, 'image/png');
      }
    }
  };

  useEffect(() => {
    const checkPermission = async () => {
      if (navigator.permissions) {
        try {
          const permissionStatus = await navigator.permissions.query({
            name: 'camera' as PermissionName,
          });
          if (permissionStatus.state === 'granted') {
            startCamera();
            setHasPermission(true);
          } else {
            setHasPermission(false);
          }
          permissionStatus.onchange = () => {
            if (permissionStatus.state === 'granted') {
              startCamera();
              setHasPermission(true);
            } else {
              setHasPermission(false);
              stopCamera();
            }
          };
        } catch (error) {
          console.error('Error querying camera permission:', error);
          setHasPermission(false);
        }
      } else {
        // Fallback for browsers that do not support Permissions API
        setHasPermission(false);
      }
    };
    checkPermission();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  if (hasPermission === null) {
    return null; // Or a loading spinner
  }

  if (!hasPermission) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: '#FFFFFF',
          textAlign: 'center',
          padding: '20px',
        }}
      >
        <Camera size={80} color="#FF6B35" />
        <h1
          style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#2D3748',
            marginBottom: '10px',
          }}
        >
          Camera Access Required
        </h1>
        <p
          style={{
            fontSize: '16px',
            color: '#718096',
            marginBottom: '40px',
            maxWidth: '300px',
          }}
        >
          We need your permission to use the camera to capture your food experiences
        </p>
        <button
          onClick={startCamera}
          style={{
            backgroundColor: '#FF6F2C',
            color: '#FFFFFF',
            padding: '15px 30px',
            borderRadius: '8px',
            fontSize: '18px',
            fontWeight: 'bold',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0px 4px 10px rgba(255, 111, 44, 0.3)',
          }}
          type="button"
        >
          Grant Permission
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000000',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
      }}
    >
      <video ref={videoRef} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
      <button
        onClick={takePhoto}
        style={{
          position: 'absolute',
          bottom: '20px',
          backgroundColor: '#FF6F2C',
          color: '#FFFFFF',
          padding: '15px 30px',
          borderRadius: '8px',
          fontSize: '18px',
          fontWeight: 'bold',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0px 4px 10px rgba(255, 111, 44, 0.3)',
        }}
        type="button"
      >
        Take Photo
      </button>
    </div>
  );
};

export default CameraAccess;
