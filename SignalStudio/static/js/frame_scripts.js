let sin_wave = new simProcessing();
// Script for reloding the data
var ampSlider = document.getElementById("amp");
var ampOutput = document.getElementById("ampOutput");
var freqSlider = document.getElementById("freq");
var freqOutput = document.getElementById("freqOutput");
var noiseToggle = document.getElementById("noiseToggle");
var addNoiseBtn = document.getElementById("add-noise-btn");
var snrValue = document.getElementById("snrValue");
var SRSLider = document.getElementById("samplingRate");
var SROutput = document.getElementById("SROutput");
ampOutput.innerHTML = ampSlider.value;
freqOutput.innerHTML = freqSlider.value;
SROutput.innerHTML = SRSLider.value;

//For the original signal graph, plot signal from inital value on freq/amp sliders
sin_wave.plot(ampSlider.value, freqSlider.value);
Plotly.newPlot(
  "plot2",
  [{ x: [0], y: [0] }],
  { yaxis: { range: [-11, 11] }, xaxis: { range: [-0.5, 6] } },
  sin_wave.config
);
//for the sampled signal graph, plot an inital signal from the values on the sliders
sin_wave.sampling(SRSLider.value);

// Function that updates the numerical value under the slider when you change the value
SRSLider.oninput = () => {
  SROutput.innerHTML = SRSLider.value;
};

SRSLider.addEventListener("mouseup", async function () {
  let samplingRate = SRSLider.value;
  sin_wave.sampling(samplingRate);
  await sin_wave.animatePlot("plot2", sin_wave.sampledSignal);
});

//function that changes original signal when slider value changes
ampSlider.addEventListener("mouseup", async function () {
  let amp = this.value;
  ampOutput.innerHTML = amp;
  let samplingRate = SRSLider.value;
  sin_wave.change_amp(amp);
  if (noiseToggle.checked) {
    sin_wave.generateNoise(SNR);
    await sin_wave.animatePlot("plot1", sin_wave.noisySignal);
  } else {
    await sin_wave.animatePlot("plot1", sin_wave.data);
  }
  sin_wave.sampling(samplingRate);
  await sin_wave.animatePlot("plot2", sin_wave.sampledSignal);

  console.log();
});
// Function that updates the sampled signal graph
freqSlider.addEventListener("mouseup", async function () {
  let freq = this.value;
  freqOutput.innerHTML = freq;
  let samplingRate = SRSLider.value;
  sin_wave.change_freq(freq);
  if (noiseToggle.checked) {
    sin_wave.generateNoise(SNR);
    await sin_wave.animatePlot("plot1", sin_wave.noisySignal);
  } else {
    await sin_wave.animatePlot("plot1", sin_wave.data);
  }
  sin_wave.sampling(samplingRate);
  await sin_wave.animatePlot("plot2", sin_wave.sampledSignal);
});

//function that toggles noise and shows/hides noise section
noiseToggle.checked = false;
const on_change = () => {
  console.log("The checkbox was toggled");
  if (noiseToggle.checked) {
    //show noise section
    document.getElementById("add-noise-section").style.display = "block";
    if (snrValue.value) {
      sin_wave.generateNoise(SNR);
      sin_wave.plotNoisySignal();
    }
  } else {
    //hide noise signal, remove the noisy signal and display original signal
    document.getElementById("add-noise-section").style.display = "none";
    //code that displays original signal without noise
    console.log("noise removed");
    Plotly.newPlot("plot1", sin_wave.data, sin_wave.layout, sin_wave.config);
    console.log(sin_wave.data[0].y);
    console.log(sin_wave.noisySignal[0].y);
  }
};
//first make sure checkbox is turned off when page loads
// noiseToggle.addEventListener("change", function (e) {
//   if (e.target.checked) {
//     //show noise section
//     document.getElementById("add-noise-section").style.display = "block";
//     let samplingRate = SRSLider.value;
//     sin_wave.sampling(samplingRate);
//     if(snrValue.value){
//       sin_wave.plotNoisySignal()
//     }
//   }
//   else {
//     //hide noise signal, remove the noisy signal and display original signal
//     document.getElementById("add-noise-section").style.display = "none";
//     //code that displays original signal without noise
//     console.log("noise removed");
//     Plotly.newPlot("plot1", sin_wave.data, sin_wave.layout, sin_wave.config);
//     console.log(sin_wave.data[0].y);
//   }
// });

//method that runs when you click the apply noise button
addNoiseBtn.addEventListener("click", function () {
  //check that method works, obviously
  console.log("Hello there");
  //get the input value from the input field and print it on the console
  SNR = snrValue.value;
  //Use the value to generate noise
  // sin_wave.plot(ampSlider.value, freqSlider.value);
  sin_wave.generateNoise(SNR);
  sin_wave.plotNoisySignal();
});

// function showNoiseSection (box) {
//     if(chkbox.checked){
//      document.getElementById(box).style.display = "block";
//    }else {
//      document.getElementById(box).style.display = "none";
//    }
// }
