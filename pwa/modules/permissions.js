/**
 * Permission requests — camera, mic, GPS.
 * Returns { camera, mic, gps } where each is true | false | 'denied'.
 */

export async function requestPermissions() {
  const result = { camera: false, mic: false, gps: false };

  // Camera
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    stream.getTracks().forEach(t => t.stop());
    result.camera = true;
  } catch (err) {
    result.camera = err.name === 'NotAllowedError' ? 'denied' : false;
  }

  // Microphone
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach(t => t.stop());
    result.mic = true;
  } catch (err) {
    result.mic = err.name === 'NotAllowedError' ? 'denied' : false;
  }

  // Geolocation
  result.gps = await new Promise(resolve => {
    if (!navigator.geolocation) { resolve(false); return; }
    navigator.geolocation.getCurrentPosition(
      () => resolve(true),
      err => resolve(err.code === err.PERMISSION_DENIED ? 'denied' : false),
      { timeout: 5000 }
    );
  });

  return result;
}

export async function getGPS() {
  return new Promise(resolve => {
    if (!navigator.geolocation) { resolve(null); return; }
    navigator.geolocation.getCurrentPosition(
      pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy }),
      () => resolve(null),
      { timeout: 8000, maximumAge: 30000 }
    );
  });
}
