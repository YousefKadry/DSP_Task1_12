let sin_wave = new simProcessing();
// Script for reloding the data
var ampSlider = document.getElementById("amp");
var ampOutput = document.getElementById("ampOutput");
var freqSlider = document.getElementById("freq");
var freqOutput = document.getElementById("freqOutput");
var SRSLider = document.getElementById("samplingRate")
var SROutput = document.getElementById("SROutput")
ampOutput.innerHTML = ampSlider.value;
freqOutput.innerHTML = freqSlider.value;
SROutput.innerHTML = SRSLider.value;

//For the original signal graph, plot signal from inital value on freq/amp sliders
sin_wave.plot(ampSlider.value, freqSlider.value);
Plotly.newPlot('plot2', [{x:[0],y:[0]}], {yaxis:{range:[-11, 11]},
xaxis:{range:[-11, 11]}}, this.config)
//for the sampled signal graph, plot an inital signal from the values on the sliders
sin_wave.sampling(SRSLider.value);

// Function that updates the numerical value under the slider when you change the value
SRSLider.oninput = ()=>{
  SROutput.innerHTML = SRSLider.value;
}

SRSLider.addEventListener("mouseup", function () {
  let samplingRate = SRSLider.value;
  sin_wave.sampling(samplingRate);
})

ampSlider.addEventListener("mouseup", async function () {
  let amp = this.value
  ampOutput.innerHTML = amp;
  let samplingRate = SRSLider.value;
  await sin_wave.change_amp(amp)
  sin_wave.sampling(samplingRate);
  }
  )


freqSlider.addEventListener("mouseup", async function () {
  let freq = this.value
  freqOutput.innerHTML = freq;
  let samplingRate = SRSLider.value;
  await sin_wave.change_freq(freq)
  sin_wave.sampling(samplingRate);
})
