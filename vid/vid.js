const player       = document.querySelector('.player');
const video        = player.querySelector('.viewer');
const controls     = player.querySelector('.player__controls')
const toggle       = controls.querySelector('.player__controls--toggle');
const skipButtons  = player.querySelectorAll('[data-skip]');
const ranges       = player.querySelectorAll('.player__controls--slider');
const progress     = player.querySelector('.player__progress');
const progressBar  = player.querySelector('.player__progress--filled');
const muteBtn      = controls.querySelector('.player__controls--mute');
const fullscreen   = controls.querySelector('.player__controls--fullscreen');
const videoList    = document.querySelector('.player__list');
const videoItem    = videoList.querySelectorAll('.player__list--item');
const videoTracks  = Array.from(videoList.querySelectorAll('.player__list--link[data-vid-track]'));


function togglePlay() {
    const method = video.paused ? 'play' : 'pause';
    video[method]();
}
function toggleVolume() {
    video.muted = video.muted ? false : true;
}

function updateBtn() {
    const icon = this.paused ? '▶️' : '⏸';
    toggle.textContent = icon;
}

function skip() {
    console.log('skipping');
    video.currentTime = video.currentTime += parseFloat(this.dataset.skip);
}

function handleRangeUpdate() {
  video[this.name] = this.value;
}

function handleProgress() {
  const percent = (video.currentTime / video.duration) * 100;
  progressBar.style.flexBasis = `${percent}%`;
}

function scrub(e) {
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
  video.currentTime = scrubTime;
}

const fullScreenEnabled = !!(document.fullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled || document.webkitSupportsFullscreen || document.webkitFullscreenEnabled || document.createElement('video').webkitRequestFullScreen);

if (!fullScreenEnabled) {
   fullscreen.style.display = 'none';
}

function isFullScreen () {
   return !!(document.fullScreen || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || document.fullscreenElement);
}

function handleFullscreen () {
   if (isFullScreen()) {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
      else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen();
      else if (document.msExitFullscreen) document.msExitFullscreen();
      setFullscreenData(false);
   } else {
      if (player.requestFullscreen) player.requestFullscreen();
      else if (player.mozRequestFullScreen) player.mozRequestFullScreen();
      else if (player.webkitRequestFullScreen) player.webkitRequestFullScreen();
      else if (player.msRequestFullscreen) player.msRequestFullscreen();
      setFullscreenData(true);
   }
}

function videoTrack(e){
    video.src = e.path[1].dataset.vidTrack;
    video.poster = e.path[1].dataset.poster;
    video.play();
};

video.addEventListener('click', togglePlay);
video.addEventListener('play', updateBtn);
video.addEventListener('pause', updateBtn);
video.addEventListener('timeupdate', handleProgress);
videoItem.forEach(videoItem => videoItem.addEventListener('click', (e) => videoTrack(e)));

fullscreen.addEventListener('click', handleFullscreen);
muteBtn.addEventListener('click', toggleVolume);
toggle.addEventListener('click', togglePlay);
skipButtons.forEach(button => button.addEventListener('click', skip));
ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
ranges.forEach(range => range.addEventListener('mousemove', handleProgress));

let mousedown = false;
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);
