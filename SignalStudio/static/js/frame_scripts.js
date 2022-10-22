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
let composeBtn = document.getElementById("compose");
let composeForm = document.getElementById("composerForm");
let addSignalBtn = document.getElementById("addSignalBtn");
let signalsMenue = document.getElementById("addedSignals");
let deleteSignalBtn = document.getElementById('deleteBtn');
let importBtn = document.getElementById('importSignal')
let saveBtn = document.getElementById('saveSignal')
let downloadLink = document.getElementById('download')
ampOutput.innerHTML = ampSlider.value;
freqOutput.innerHTML = freqSlider.value;
SROutput.innerHTML = SRSLider.value;

//For the original signal graph, plot signal from inital value on freq/amp sliders
Plotly.newPlot(
  "plot1",
  [{ x: [0], y: [0] }],
  {title: "Signal displayed here",
            font: { size: 18 }},
  sin_wave.config);
Plotly.newPlot(
  "plot2",
  [{ x: [0], y: [0] }],
  {title: "Sampled Signal",
            font: { size: 18 }},
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
  if(noiseToggle.checked){
  sin_wave.sampling(samplingRate, sin_wave.noisySignal);
  sin_wave.animatePlot("plot2", sin_wave.sampledSignal)
  await sin_wave.animatePlot("plot2", sin_wave.sampledSignal);
  }

  sin_wave.sampling(samplingRate);
  sin_wave.animatePlot("plot2", sin_wave.sampledSignal)
  await sin_wave.animatePlot("plot2", sin_wave.sampledSignal);
});

//function that changes original signal when slider value changes
ampSlider.oninput = async function () {
  let amp = this.value;
  ampOutput.innerHTML = amp;
  
};
// Function that updates the sampled signal graph
freqSlider.oninput = async function () {
  let freq = this.value;
  freqOutput.innerHTML = freq;
  
};

//function that toggles noise and shows/hides noise section
noiseToggle.checked = false;
const on_change = () => {
  console.log("The checkbox was toggled");
  if (noiseToggle.checked) {
    //show noise section
    document.getElementById("add-noise-section").style.display = "block";
    if (snrValue.value) {
      sin_wave.generateNoise(snrValue.value);
      sin_wave.plotNoisySignal();
      sin_wave.sampling(SRSLider.value, sin_wave.noisySignal);
      sin_wave.animatePlot("plot2", sin_wave.sampledSignal);
      sin_wave.animatePlot("plot2", sin_wave.sampledSignal);
    }
  } else {
    //hide noise signal, remove the noisy signal and display original signal
    document.getElementById("add-noise-section").style.display = "none";
    //code that displays original signal without noise
    console.log("noise removed");
    Plotly.newPlot("plot1", sin_wave.data, sin_wave.layout, sin_wave.config);
    sin_wave.sampling(SRSLider.value, sin_wave.noisySignal);
    sin_wave.animatePlot("plot2", sin_wave.sampledSignal);
    sin_wave.animatePlot("plot2", sin_wave.sampledSignal);
    console.log(sin_wave.data[0].y);
    console.log(sin_wave.noisySignal[0].y);
  }
};


//method that runs when you click the apply noise button
addNoiseBtn.onclick =  () => {
  //check that method works, obviously
  console.log("Hello there");
  //get the input value from the input field and print it on the console
  SNR = snrValue.value;
  //Use the value to generate noise
  sin_wave.generateNoise(SNR);
  sin_wave.plotNoisySignal();
  sin_wave.sampling(SRSLider.value, sin_wave.noisySignal);
  sin_wave.animatePlot("plot2", sin_wave.sampledSignal);
  sin_wave.animatePlot("plot2", sin_wave.sampledSignal);
};

let formStatus = false;
composeForm.style.display = "none";
composeBtn.onclick = () => {
  if (!formStatus) {
    composeForm.style.display = "block";
    formStatus = true;
  } else {
    composeForm.style.display = "none";
    formStatus = false;
  }
}
  addSignalBtn.onclick = async() => {
    sin_wave.addSignal(ampSlider.value, freqSlider.value);
    if (noiseToggle.checked) {
      sin_wave.generateNoise(snrValue.value);
      sin_wave.animatePlot("plot1", sin_wave.noisySignal);
      await sin_wave.animatePlot("plot1", sin_wave.noisySignal);
      sin_wave.sampling(SRSLider.value, sin_wave.noisySignal);
      sin_wave.animatePlot("plot2", sin_wave.sampledSignal);
      sin_wave.animatePlot("plot2", sin_wave.sampledSignal);
    } else {
      sin_wave.animatePlot("plot1", sin_wave.data);
      console.log(sin_wave.data)
      await sin_wave.animatePlot("plot1", sin_wave.data);
      sin_wave.sampling(SRSLider.value);
      sin_wave.animatePlot("plot2", sin_wave.sampledSignal);
      sin_wave.animatePlot("plot2", sin_wave.sampledSignal);

    }
    let signalNum = sin_wave.addedSignalNum
    let option = document.createElement("option");
    option.text = `Signal${signalNum}  amp=${ampSlider.value}, freq=${freqSlider.value}`
    option.value = `Signal${signalNum}`
    signalsMenue.appendChild(option);
    

  };

  deleteSignalBtn.onclick = async ()=>{
    sin_wave.deleteSignal(signalsMenue.value);
    if (noiseToggle.checked) {
      sin_wave.generateNoise(snrValue.value);
      sin_wave.animatePlot("plot1", sin_wave.noisySignal);
      await sin_wave.animatePlot("plot1", sin_wave.noisySignal);
      sin_wave.sampling(SRSLider.value, sin_wave.noisySignal);
      sin_wave.animatePlot("plot2", sin_wave.sampledSignal);
      sin_wave.animatePlot("plot2", sin_wave.sampledSignal);
    } else {
      sin_wave.animatePlot("plot1", sin_wave.data);
      await sin_wave.animatePlot("plot1", sin_wave.data);
      sin_wave.sampling(SRSLider.value);
      sin_wave.animatePlot("plot2", sin_wave.sampledSignal);
      sin_wave.animatePlot("plot2", sin_wave.sampledSignal);

    }
    signalsMenue.remove(signalsMenue.selectedIndex)
    

  }

  importBtn.oninput=(e)=>{
    let file = e.target.files[0];
    // let data = d3.csvParse(file);
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function (event) {
        var csvData = event.target.result;

        let parsedCSV = d3.csvParse(csvData)
        sin_wave.importSignal(parsedCSV)
        let signalNum = sin_wave.addedSignalNum
        let option = document.createElement("option");
        option.text = `Signal${signalNum}  imported Signal`
        option.value = `Signal${signalNum}`
        signalsMenue.appendChild(option);
        sin_wave.animatePlot('plot1', sin_wave.data)
        sin_wave.animatePlot('plot1', sin_wave.data)

      }
  }
  saveBtn.onclick = ()=>{
    let csvData = []
    if (noiseToggle.checked) {
      csvData = sin_wave.saveCSV(sin_wave.noisySignal[0].x, sin_wave.noisySignal[0].y)
    }
    else{
      csvData = sin_wave.saveCSV(sin_wave.data[0].x, sin_wave.data[0].y)
    }
    let csv = 'x,y\n'; 
    //merge the data with CSV  
    csvData.forEach(function(row) {  
            csv += row.join(',');  
            csv += "\n";  
    });  
    //display the created CSV data on the web browser   

    downloadLink.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);  
    //provide the name for the CSV file to be downloaded  
    downloadLink.download = 'Signal.csv';  
}  
  

