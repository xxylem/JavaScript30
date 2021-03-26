/* Get our elements */
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider')
const fullscreen = player.querySelector('.fullscreen');

let rangeMouseClicked = false;
let scrubMouseClicked = false;
let videoFullscreen = false;

/* Build our functions */
function togglePlay() {
    video.paused ? video.play() : video.pause();
}

function updateButton() {
    const icon = this.paused ? '►' : '❚ ❚';
    toggle.textContent = icon;
}

function skip() {
    video.currentTime += parseFloat(this.dataset.skip);
}

function handleRangeUpdate() {
    video[this.name] = this.value;
}

function handleRangeUpdateMouseMove() {
    if (rangeMouseClicked) {
        handleRangeUpdate.bind(this)();
    }
}

function rangeMouseClickOn() {
    rangeMouseClicked = true;
}

function rangeMouseClickOff() {
    rangeMouseClicked = false;
}

function handleProgress() {
    const percent = (video.currentTime / video.duration) * 100;
    progressBar.style.flexBasis = `${percent}%`;
}

function scrub(e) {
    const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
    video.currentTime = scrubTime;
}

function scrubMouseClickOn() {
    scrubMouseClicked = true;
}

function scrubMouseClickOff() {
    scrubMouseClicked = false;
}

function scrubMouseMove(e) {
    if (scrubMouseClicked) {
        scrub.bind(this)(e);
    }
}

function toggleFullscreen(e) {
    if (!document.fullscreenElement) {
        player.requestFullscreen();
    }
    else {
        document.exitFullscreen();
    }
}

/* Hook up the event listeners */
video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);

toggle.addEventListener('click', togglePlay);

skipButtons.forEach(
    b => b.addEventListener('click', skip)
);

ranges.forEach(
    r => r.addEventListener('change', handleRangeUpdate)
);
ranges.forEach(
    r => r.addEventListener('mousemove', handleRangeUpdateMouseMove)
);
ranges.forEach(
    r => r.addEventListener('mousedown', rangeMouseClickOn)
);
ranges.forEach(
    r => r.addEventListener('mouseup', rangeMouseClickOff)
);

progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', scrubMouseMove);
progress.addEventListener('mousedown', scrubMouseClickOn);
progress.addEventListener('mouseup', scrubMouseClickOff);

fullscreen.addEventListener('click', toggleFullscreen);

document.addEventListener('keydown', e => e.key === 'f' && toggleFullscreen(e));
document.addEventListener('keydown', e => e.key === ' ' && togglePlay(e));
document.addEventListener('keydown', e => e.key === 'ArrowRight' && skip.bind({ dataset: { skip: 25 } })());
document.addEventListener('keydown', e => e.key === 'ArrowLeft' && skip.bind({ dataset: { skip: -25 } })());

handleProgress();