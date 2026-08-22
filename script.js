function downloadAPK() {

  const apkPath = "apk/SuperVideoPlayer.apk";

  const link = document.createElement("a");

  link.href = apkPath;
  link.download = "SuperVideoPlayer.apk";

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
}
