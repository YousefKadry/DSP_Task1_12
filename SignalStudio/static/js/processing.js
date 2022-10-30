class sigProcessing {
  constructor() {
    // Constructor
    this.data = [{ x: [], y: [], mode: "lines",line:{size: 5},  type: "line" }];
    this.freq = 0;
    this.amp = 0;
    this.addedSignalNum = 0;
    this.noisySignal = [{ x: [0], y: [0], mode: "lines", type: "line" }];
    this.sampledSignal = [{ x: [0], y: [0], mode: "markers"}];
    this.reconSignal = [{ x: [0], y: [0], mode: "lines", line: {dash: 'dashdot', width:3}}];
    this.config = { responsive: true };
    this.time = 5;
    this.step = 0.001;
    this.signalList = {};
    this.layout = {
      title: "",
      font: { size: 14 },
      margin: {
        b: 40,t: 40,l: 80,r: 45},
        legend: {x: 0.04,xanchor:'left', y:1.1},
        xaxis:{range:[0,4], title:'Time(s)'},
        yaxis:{range:[-10,10], title:'Voltage(mV)'}

    };
  }

  // Function for generating a sinusoidal component
  generate(amp, f, time = this.time, step = this.step) {
    const exp = "amp * Math.sin(2*pi*x*f)";
    const pi = Math.PI;
    this.freq = f;
    this.amp = amp;
    this.time = time;
    let xdata = [];
    let ydata = [];
    for (let x = 0; x <= this.time; x += step) {
      xdata.push(x);
      ydata.push(eval(exp));
    }
    const data = [{ x: xdata, y: ydata, mode: "lines", type: "line" }];
    return data;
  }
  //Function that samples the current signal and updates the sampledSignal attribute
  sampling(samplingRate, data=this.data) {
    let sampledX = [];
    let sampledY = [];
    let x = [...data[0].x];
    let y = [...data[0].y];
    let step = x.length / x[x.length - 1] / samplingRate;
    let index
    // let step = Math.floor(x.length / samplingRate);

    for (let i = 0; i < x.length; i += step) {
      index = Math.round(i)
      sampledX.push(x[index]);
      sampledY.push(y[index]);
    }

    this.sampledSignal = [
      { x: sampledX, y: sampledY, marker:{size:8,color:'black'}, mode: "markers" },
    ];
  }

  //function that does sinc interpolation and fills up the reconSignal data
  reconstructSig(samplingRate) {
    this.reconSignal[0].x = [...this.data[0].x];
    let reconY = [];
    let Fs = samplingRate;
    //calculating the reconstructed signal using sinc interpolation
    for (let itr = 0; itr < this.data[0].x.length; itr += 1) {
      let interpolatedValue = 0;
      for (let itrS = 0; itrS < this.sampledSignal[0].y.length; itrS += 1) {
        let intrpolationComp =
         Math.PI * (this.reconSignal[0].x[itr] - itrS / Fs) * Fs;
        interpolatedValue +=
          this.sampledSignal[0].y[itrS] *
          (Math.sin(intrpolationComp) / intrpolationComp);
      }
      reconY.push(interpolatedValue);
    }
    this.reconSignal[0].y = reconY;
  }

  //plotting the sampled and and reconstructed signal
  updateGraph(samplingRate, noiseOn=noiseToggle.checked) {
    this.reconstructSig(samplingRate);
    this.reconSignal[0].name = "Reconstructed";
    this.sampledSignal[0].name = "Sampled";
    this.data[0].name="Original";
    this.noisySignal[0].name="Original";
    // check is the noise is toggled, if yes, plot the noisy data + sampled + reconstructed
    if(noiseOn){
      //plotting the signal
      Plotly.newPlot(
        "plot1",
        [this.noisySignal[0], this.reconSignal[0], this.sampledSignal[0]],
        this.layout,
        this.config
      );
    // if not, plot the original data + sampled + reconstructed
    }else {
      //plotting the signal
      Plotly.newPlot(
        "plot1",
        [this.data[0], this.reconSignal[0], this.sampledSignal[0]],
        this.layout,
        this.config
      );
    }

  }

  //this function generates the noisy signal and plots it
  generateNoise(SNR) {
    //check to make sure that the SNR is a positive value, if not, no noise will be added
    if (SNR >= 0) {
      //print the SNR value, for reasons.
      this.noisySignal[0].y = [...this.data[0].y];
      let copiedY = [...this.data[0].y];
      //we calculate the average of the square values of y (aka the power)
      let sum_power = 0;
      for (let itr = 0; itr < copiedY.length; itr += 1) {
        let powerComponent = Math.pow(copiedY[itr], 2);
        sum_power += powerComponent;
      }
      //then we get the average of the power (divide by the number of values)
      let signal_power = Math.sqrt(sum_power / copiedY.length);

      //we add a random noise component based on the SNR to the signal values
      for (let itr = 0; itr < copiedY.length; itr += 1) {
        let noiseComponent = this.getNormalDistRand(
          0,
          signal_power / SNR
        );
        // noiseComponent.push(getNormalDistRand(mean, stddev));
        this.noisySignal[0].y[itr] =
          parseFloat(this.noisySignal[0].y[itr]) + noiseComponent;
      }
      this.noisySignal[0].x = this.data[0].x;
    }
  }


  //For generating a gaussian distributed variable
  boxMullerTransform() {
    const u1 = Math.random();
    const u2 = Math.random();

    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    const z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);

    return { z0, z1 };
    // return z0;
  }
  getNormalDistRand(mean, stddev) {
    const { z0, _ } = this.boxMullerTransform();
    return z0 * stddev + mean;
  }

  // Funtions that add/remove component to the signal (by generating comp then adding it to the data)
  addSignal(amp, freq) {
    let addedSignal = [];
    if (this.data[0].y.length > 2) {
      let step = this.data[0].x[1] - this.data[0].x[0];
      let time = this.data[0].x[this.data[0].x.length - 1];
      addedSignal = this.generate(amp, freq, time, step);
    } else {
      this.data = this.generate(0, 0);
      addedSignal = this.generate(amp, freq);
    }
    this.addedSignalNum += 1;
    this.signalList[`Signal${this.addedSignalNum}`] = addedSignal;
    let y = addedSignal[0].y;
    for (let i = 0; i < y.length; i += 1) {
      this.data[0].y[i] = parseFloat(this.data[0].y[i]) + y[i];
    }
  }
  deleteSignal(signalName) {
    let deletedSignal = this.signalList[signalName];
    let y = deletedSignal[0].y;
    for (let i = 0; i < y.length; i += 1) {
      this.data[0].y[i] -= y[i];
    }
    delete this.signalList[signalName];
  }

  // For importing the signal from csv file
  importSignal(parsedFile) {
    this.signalList = [];
    let x = [];
    let y = [];
    let keys = Object.keys(parsedFile[0]);
    parsedFile.forEach(function (d, i) {
      // if (i == 0) return true; // skip the header
      x.push(d[keys[0]]);
      y.push(d[keys[1]]);
    });
    this.data[0].x = x;
    this.data[0].y = y;
    this.addedSignalNum = 1;
    let data = [{ x: [...x], y: [...y], mode: "lines", type: "line" }];
    this.signalList[`Signal${this.addedSignalNum}`] = data;
  }

  // For Saving the data to a csv file
  saveCSV(x, y) {
    let csvData = [];
    for (let i = 0; i < x.length; i += 1) {
      csvData.push([x[i], y[i]]);
    }
    return csvData;
  }

}
