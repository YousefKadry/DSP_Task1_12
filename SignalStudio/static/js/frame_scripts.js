let sin_wave = new simProcessing();
sin_wave.plot(10, 0.5);
Plotly.newPlot('plot2', [{x:[0],y:[0]}], {yaxis:{range:[-11, 11]},
xaxis:{range:[0, 6]}})


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







