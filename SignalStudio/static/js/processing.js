class simProcessing {
    constructor() {
    // Constructor
        this.data = [{ x: [], y: [], mode: "lines", type: "line" }];
        this.freq = 0;
        this.amp = 0;
        this.addedSignalNum = 0
        this.noisySignal = [{ x: [0], y: [0], mode: "lines", type: "line" }];
        this.sampledSignal = [{ x: [0], y: [0], mode: "lines", type: "line" }];
        this.config = { responsive: true };
        this.time = 5
        this.signalList = {}
        this.layout = {
            title: "Signal displayed here",
            font: { size: 18 },
            
    };
    }


    generate(amp, f, time = this.time) {
        const exp = "amp * Math.sin(2*pi*x*f)";
        const pi = 22 / 7;
        this.freq = f;
        this.amp = amp;
        this.time = time;
        let xdata = [];
        let ydata = [];
        for (var x = 0; x <= this.time; x += 0.001) {
            xdata.push(x);
            ydata.push(eval(exp));
        }
        const data = [{ x: xdata, y: ydata, mode: "lines", type: "line" }];
        return data;
    }


    plot(amp, freq) {
        this.data = this.generate(amp, freq);
        Plotly.newPlot("plot1", this.data, this.layout, this.config);
    }



    change_amp(amp){
        this.data = this.generate(amp, this.freq);
        this.amp = amp
    }

    change_freq(freq){
        this.data = this.generate(this.amp, freq);
        this.freq = freq
    }



    sampling(samplingRate, data = this.data){
        let sampledX = [];
        let sampledY = [];
        let x = [...data[0].x]
        console.log(x.length)
        let y = [...data[0].y]
        console.log(y.length)
        let step = Math.floor((x.length / x[x.length-1])/samplingRate)
        console.log(step)

        for(let i=0; i<x.length; i+=step){

            sampledX.push(x[i])
            sampledY.push(y[i])
        }
        console.log(sampledY)
        
        this.sampledSignal = [{x:sampledX, y:sampledY, type: "line", mode: 'markers'}] 
        console.log(this.sampledSignal)

        //  Resampler/interpolator code
        // let newSamples = waveResampler.resample(data[0].y , samplingRate , 5000, {method: "sinc", LPF: true});
        // console.log(newSamples);
        // let data1 = [{x:this.data[0].x, y:newSamples, type: "line", mode: 'line'}]

    }



//this function generates the noisy signal and plots it
    generateNoise(SNR){
     //check to make sure that the SNR is a positive value, if not, no noise will be added
        if(SNR>=0){
        //print the SNR value, for reasons.
        console.log(SNR);
        this.noisySignal[0].y = [...this.data[0].y]
        var copiedY =  this.data[0].y;
        //we calculate the average of the square values of y (aka the power)
        var sum_power =0;
        for (var itr = 0; itr <copiedY.length ; itr += 1) {
            var powerComponent = Math.pow(copiedY[itr],2);
            sum_power += powerComponent;
            // console.log(this.noisySignal[0].y[itr]);
        }
        //then we get the average of the power (divide by the number of values)
        var signal_power = Math.sqrt(sum_power/copiedY.length);

        //we add a random noise component based on the SNR to the signal values
        for (var itr = 0; itr <copiedY.length ; itr += 1) {
            var noiseComponent = this.getNormallyDistributedRandomNumber(0, signal_power/SNR);
            // noiseComponent.push(getNormallyDistributedRandomNumber(mean, stddev));
            this.noisySignal[0].y[itr] += noiseComponent;
        }
        this.noisySignal[0].x = this.data[0].x
        // plotting the noisy signal
        }
        else {
        //this code informs the user that the SNR value is negative, could be improved
        console.log("your snr input must be a positive value");
        window.alert("your snr input must be a positive value");
        SNR=0;
        }
    }

    //functions for generating a gaussian distributed variable
    boxMullerTransform() {
        const u1 = Math.random();
        const u2 = Math.random();

        const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        const z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);

        return { z0, z1 };
    }

    
    getNormallyDistributedRandomNumber(mean, stddev) {
        const { z0, _ } = this.boxMullerTransform();

        return z0 * stddev + mean;
    }


    plotNoisySignal(){

        Plotly.newPlot("plot1", this.noisySignal, this.layout, this.config);
    }

    async animatePlot(plotName, data){
        await Plotly.animate(
            plotName,
            {
                layout: this.layout,
                data: data,
                traces: [0]
    
            },
            {
                transition: {
                duration: 500,
                easing: "cubic-in-out",
                },
                frame: {
                duration: 500,
                },
            },
            this.config
            );
        }

        addSignal(amp, freq){
            let newSignal = {amp:amp, freq:freq}
            let addedSignal = this.generate(amp, freq)
            this.addedSignalNum+=1
            if(!this.data[0].x[5]){
                this.data = this.generate(0, 0)
            }
            this.signalList[`Signal${this.addedSignalNum}`] = newSignal;
            let y = addedSignal[0].y;
            for(let i=0; i<y.length; i+=1){
                this.data[0].y[i] += y[i]
            }
        }


        deleteSignal(signalName){
            let amp = this.signalList[signalName].amp
            let freq = this.signalList[signalName].freq
            let deletedSignal = this.generate(amp, freq)
            let y = deletedSignal[0].y;
            for(let i=0; i<y.length; i+=1){
                this.data[0].y[i] -= y[i]
            }
            delete this.signalList[signalName];

        }
    }




