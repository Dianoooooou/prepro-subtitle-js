const canvas = document.getElementById('overlay');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d');
let r, v, b;
let frame = 0;
let letter = 'A';
ctx.font = "30px Verdana";
let subtitles = '';
const sub = window.Subtitle;

document.addEventListener('keydown', function(event) { letter = event.key; });

// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
// Promises. Shiffman. https://youtu.be/8R-JMcASvEQ?t=42m44s
async function preload() {
  const sub_promise = await fetch('data/subtitles.srt');
  const sub_txt = await sub_promise.text();
  subtitles = sub.parse(sub_txt); // Subtitles are now in this array ...
}

function setup() {
  prepro.play();
  prepro.addEventListener('update', update);
}

function update() {
  frame++;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const sift = prepro.currentFrame.sift;

  if (!sift) {
    return;
  }

  const keypoints = sift.keypointsA;
  // Save the context transform
  ctx.save();
  // Translate to the video element position
  ctx.translate(0, prepro.video.offset.y);

  // Scale to the video element size
  const scale = canvas.width / prepro.config.width;
  ctx.scale(scale, scale);

  for (let i = 0; i < keypoints.length; i++) {
    r = Math.floor(map(keypoints[i].y, 0, canvas.height, 255, 100));
    v = Math.floor(map(keypoints[i].y, 0, 2 * canvas.height / 3, 255, 0));
    b = 10;
    ctx.fillStyle = 'rgb(' + r + ',' + v + ',' + b + ')';
    ctx.lineWidth = 2;
    ctx.lineCap = "round";

//current Sift position
    const y = keypoints[i].y;
    const x = keypoints[i].x;

//draw letter
    ctx.save();
    ctx.beginPath();
    ctx.fillText(letter, x, y);
    ctx.stroke();
    ctx.restore();
  }
  // Restore the context transform
  ctx.restore();
}

function map(v, a, b, x, y) {
  return (v == a) ? x : (v - a) * (y - x) / (b - a) + x;
}

// Setup executes after preload
prepro.load('data/test-video').then(preload).then(setup);
