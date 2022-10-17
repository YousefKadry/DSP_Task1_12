let sin_wave = new simProcessing();
sin_wave.plot(1, 0.5);

// Script for reloding the data
var ampSlider = document.getElementById("amp");
var ampOutput = document.getElementById("ampOutput");
var freqSlider = document.getElementById("freq");
var freqOutput = document.getElementById("freqOutput");
ampOutput.innerHTML = ampSlider.value;
freqOutput.innerHTML = freqSlider.value;

ampSlider.addEventListener("mouseup", function () {
  let amp = this.value
  ampOutput.innerHTML = amp;
  sin_wave.change_amp(amp)})


freqSlider.addEventListener("mouseup", function () {
  let freq = this.value
  freqOutput.innerHTML = freq;
  sin_wave.change_freq(freq)})




