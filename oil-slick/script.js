const canvas = document.createElement("canvas");
const sandbox = new GlslCanvas(canvas);
document.body.appendChild(canvas);

let isPlaying = false;

// const sizer = () =>{
//   const ww = window.innderWidth;
//   const wh = window.innerHeight;
//   const dpi = window.devicePixelRatio;

//   const s = Math.max(ww, wh)

//   canvas.width = s * dpi
//   canvas.height = s * dpi
//   canvas.style.width = s + "px"
//   canvas.style.height = s + "px"
// }

// sizer()

//  window.addEventListener("resize", function(){
//    sizer()
//  })

// sandbox.load(frag)
// sandbox.setUniform("seed", Math.random())

//audio stuff
//
//const audioContext = new AudioContext();

const audioElement = document.querySelector("audio source");
console.log(audioElement);
//might need a play/pause based on autoplay blocking

document.addEventListener("click", function () {
  audioElement.play();
  
  if (isPlaying) {
    console.log("already playing - sorry!");
  } else {
    isPlaying = true;

    const audioCtx = new AudioContext();
    const track = audioCtx.createMediaElementSource(audioElement);
    const analyser = audioCtx.createAnalyser();

    source = track;
    source.connect(analyser);
    //analyser.connect(distortion)
    //distortion.connect(audioCtx.destination)
    analyser.fftSize = 2048;
    //fft = fast fourier transform, frequency domain is 2048

    const bufferLength = analyser.frequencyBinCount;
    console.log(bufferLength);
    let frequencyData = new Uint8Array(bufferLength);

    //get data, populate array with it

    const renderFrame = () => {
      requestAnimationFrame(renderFrame);
      analyser.getByteFrequencyData(frequencyData);
      //console.log(frequencyData)
    };

    renderFrame();
  }
});


