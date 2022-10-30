let mySignal = new sigProcessing();
// Script for loading the data and linking elements
// Signal mixer section
var ampSlider = document.getElementById("amp");
var ampOutput = document.getElementById("ampOutput");
var freqSlider = document.getElementById("freq");
var freqOutput = document.getElementById("freqOutput");
let addSignalBtn = document.getElementById("addSignalBtn");
ampOutput.innerHTML = ampSlider.value;
freqOutput.innerHTML = freqSlider.value;
// Noise section elements
var noiseToggle = document.getElementById("noiseToggle");
var snrSlider = document.getElementById("snrSlider");
var snrOutput = document.getElementById("snrOutput");
let SNR = snrSlider.value
// Sampling section
var SRSLider = document.getElementById("samplingRate");
var SROutput = document.getElementById("SROutput");
SROutput.innerHTML = SRSLider.value;
// Remove comp. section
let signalsMenue = document.getElementById("addedSignals");
let deleteSignalBtn = document.getElementById("deleteBtn");
// Import and save section
let importBtn = document.getElementById("importSignal");
let saveBtn = document.getElementById("saveSignal");
let downloadLink = document.getElementById("download");

//intialize the graph element
Plotly.newPlot(
  "plot1",
  [{ x: [0], y: [0] }],
  mySignal.layout,
  mySignal.config
);

//setting the original value under the sliders.
SROutput.innerHTML = SRSLider.value + " Hz";
ampOutput.innerHTML = ampSlider.value + " mV";
freqOutput.innerHTML = freqSlider.value + " Hz";
snrOutput.innerHTML = snrSlider.value;
//for the sampled signal graph, plot an initial signal from the values on the sliders
mySignal.sampling(SRSLider.value);

// Function that updates the numerical value under the slider when you change the value
SRSLider.oninput = () => {
  SROutput.innerHTML = SRSLider.value + " Hz";
};

SRSLider.addEventListener("mouseup", async function () {
  let samplingRate = SRSLider.value;
  if (noiseToggle.checked) {
    //recalculate the signal
    mySignal.sampling(samplingRate, mySignal.noisySignal);
  } else {
    //calculating the signal
    mySignal.sampling(samplingRate);
  }
  //updating the sampling and reconstructed graph
  mySignal.updateGraph(SRSLider.value);
});

//function that changes original signal when slider value changes
ampSlider.oninput = async function () {
  let amp = this.value;
  ampOutput.innerHTML = amp + " mV";
};
// Function that updates the sampled signal graph
freqSlider.oninput = async function () {
  let freq = this.value;
  freqOutput.innerHTML = freq + " Hz";
};
snrSlider.oninput = async function () {
  let snr = this.value;
  snrOutput.innerHTML = snr;
};

// initializing the noise section as disabled
noiseToggle.checked = false;
document.getElementById("add-noise-section").style.opacity = 0.5;
snrSlider.disabled = true;
//Function for turning noise on/off
const on_change = () => {
  if (noiseToggle.checked) {
    //show noise section
    mySignal.generateNoise(SNR);
    snrSlider.disabled = false; //enable the slider if the chkbox is checked
    mySignal.sampling(SRSLider.value, mySignal.noisySignal);
    document.getElementById("add-noise-section").style.opacity = 1;
  } else {
    //code that displays original signal without noise
    document.getElementById("add-noise-section").style.opacity = 0.5  ;
    snrSlider.disabled = true; //disable the slider if the box in unchecked
    mySignal.sampling(SRSLider.value);
  }
  mySignal.updateGraph(SRSLider.value);
};

//method that runs when you click the apply noise button
snrSlider.addEventListener('mouseup',  () => {
  //get the input value from the input field and print it on the console
  SNR = snrSlider.value;
  //Use the value to generate noise
  mySignal.generateNoise(SNR);
  mySignal.sampling(SRSLider.value, mySignal.noisySignal);
  mySignal.updateGraph(SRSLider.value);
});

let sigNumber = 0;
addSignalBtn.onclick = async () => {
  mySignal.addSignal(ampSlider.value, freqSlider.value);
  sigNumber+=1;
  deleteSignalBtn.disabled = false;
  deleteSignalBtn.style.opacity = 11;

  let noiseOn = noiseToggle.checked;
  if (noiseOn) {
    mySignal.generateNoise(SNR);
    mySignal.sampling(SRSLider.value, mySignal.noisySignal);
  } else {
    mySignal.sampling(SRSLider.value);
  }
  //update the graph
  mySignal.updateGraph(SRSLider.value, noiseOn);

  let signalNum = mySignal.addedSignalNum;
  let option = document.createElement("option");
  option.text = `Signal${signalNum}  Amp=${ampSlider.value}, freq=${freqSlider.value}`;
  option.value = `Signal${signalNum}`;
  signalsMenue.appendChild(option);
};
deleteSignalBtn.disabled = true;
deleteSignalBtn.style.opacity = 0.5

deleteSignalBtn.onclick = async () => {
  mySignal.deleteSignal(signalsMenue.value);
  if (noiseToggle.checked) {
    mySignal.generateNoise(SNR);
    mySignal.sampling(SRSLider.value, mySignal.noisySignal);
  } else {
    mySignal.sampling(SRSLider.value);
  }
  mySignal.updateGraph(SRSLider.value);
  signalsMenue.remove(signalsMenue.selectedIndex);
  sigNumber-=1
  if(sigNumber == 0){
    deleteSignalBtn.disabled = true;
    deleteSignalBtn.style.opacity = 0.5
  }
};

importBtn.oninput = (e) => {
  let file = e.target.files[0];
  // let data = d3.csvParse(file);
  var reader = new FileReader();
  reader.readAsText(file);
  reader.onload = function (event) {
    var csvData = event.target.result;
    let parsedCSV = d3.csvParse(csvData);
    mySignal.importSignal(parsedCSV);
    let signalNum = mySignal.addedSignalNum;
    signalsMenue.options.length = 0;
    let option = document.createElement("option");
    option.text = `Signal${signalNum}  imported Signal`;
    option.value = `Signal${signalNum}`;
    signalsMenue.appendChild(option);
    if(noiseToggle.checked){
      mySignal.sampling(SRSLider.value, mySignal.noisySignal);
      ;
      
    }else{
      mySignal.sampling(SRSLider.value)
    }
    mySignal.updateGraph(SRSLider.value);
    deleteSignalBtn.disabled = false;
    deleteSignalBtn.style.opacity = 1
    sigNumber=1
  };
};
saveBtn.onclick = () => {
  let csvData = [];
  if (noiseToggle.checked) {
    csvData = mySignal.saveCSV(
      mySignal.noisySignal[0].x,
      mySignal.noisySignal[0].y
    );
  } else {
    csvData = mySignal.saveCSV(mySignal.data[0].x, mySignal.data[0].y);
  }
  let csv = "time,amplitude\n";
  //merge the data with CSV
  csvData.forEach(function (row) {
    csv += row.join(",");
    csv += "\n";
  });
  //display the created CSV data on the web browser
  downloadLink.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
  //provide the name for the CSV file to be downloaded
  downloadLink.download = "Signal.csv";
};
