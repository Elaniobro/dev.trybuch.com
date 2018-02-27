'use strict';

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
    muteBtn.innerHTML = video.muted? `<i class="fas fa-volume-off"></i>` : `<i class="fas fa-volume-up"></i>`;
}

function updateBtn() {
    const icon = this.paused ? '<i class="fas fa-play"></i>' : '<i class="fas fa-pause"></i>';
    toggle.innerHTML = icon;
}

function skip() {
    console.log('skipping');
    video.currentTime = video.currentTime += parseFloat(this.dataset.skip);
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

function handleRangeUpdate() {
    video[this.name] = this.value;
    muteBtn.innerHTML = video.muted? `<i class="fas fa-volume-off"></i>` : `<i class="fas fa-volume-up"></i>`;

}

function handleProgress() {
    const percent = (video.currentTime / video.duration) * 100;
    progressBar.style.flexBasis = `${percent}%`;
}

function handleFullscreen () {
    if (isFullScreen()) {
        console.log('isFullScreen')
        fullscreen.innerHTML = '<i class="fas fa-expand"></i>';
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
        else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen();
        else if (document.msExitFullscreen) document.msExitFullscreen();
        setFullscreenData(false);
    } else {
        console.log('!isFullScreen')
        fullscreen.innerHTML = '<i class="fas fa-compress"></i>';
        if (player.requestFullscreen) player.requestFullscreen();
        else if (player.mozRequestFullScreen) player.mozRequestFullScreen();
        else if (player.webkitRequestFullScreen) player.webkitRequestFullScreen();
        else if (player.msRequestFullscreen) player.msRequestFullscreen();
        setFullscreenData(true);
   }
}
console.log('e');
function videoTrack(e){
    console.log(e)
    console.log(e.target);
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
