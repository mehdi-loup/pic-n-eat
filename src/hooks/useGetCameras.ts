import { useEffect, useState } from 'react';

export function useGetNumberOfCameras() {
  const [numberOfCameras, setNumberOfCameras] = useState(0);
  useEffect(() => {
    async function enumerateCameras() {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter((device) => device.kind === 'videoinput');
      setNumberOfCameras(videoDevices.length);
    }
    enumerateCameras();
  }, []);

  return numberOfCameras;
}
