// Downscales the captured frame before encoding — keeps upload size and
// vision-model image tokens reasonable without needing full camera resolution.
const MAX_DIMENSION = 1024;
const JPEG_QUALITY = 0.85;

export function captureFrameAsDataUrl(video: HTMLVideoElement): string {
  const { videoWidth, videoHeight } = video;
  const scale = Math.min(1, MAX_DIMENSION / Math.max(videoWidth, videoHeight));
  const width = Math.max(1, Math.round(videoWidth * scale));
  const height = Math.max(1, Math.round(videoHeight * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not get canvas context.");
  }
  ctx.drawImage(video, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
}
