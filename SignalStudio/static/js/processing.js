class simProcessing {
    constructor() {
    // Constructor
        this.data = [{ x: [0], y: [0], mode: "lines", type: "line" }];
        this.freq = 0;
        this.amp = 0;
        this.config = { responsive: true };
        this.layout = {
            title: "Signal displayed here",
            font: { size: 18 },
            xaxis:{range:[-0.5, 6]},
            yaxis:{range:[-10, 10]}

    };
    }


    generate(amp, f) {
        const exp = "amp * Math.sin(2*pi*x*f)";
        const pi = 22 / 7;
        this.freq = f;
        this.amp = amp;
        let xdata = [];
        let ydata = [];
        for (var x = 0; x <= 5; x += 0.001) {
            xdata.push(x);
            ydata.push(eval(exp));
        }
        const data1 = [{ x: xdata, y: ydata, mode: "lines", type: "line" }];
        this.data = data1;
        return this.data;
    }


    plot(amp, freq) {
        const data = this.generate(amp, freq);
        Plotly.newPlot("plot1", data, this.layout, this.config);
    }


    async change_amp(amp) {
        let data = this.generate(amp, this.freq);
        this.amp = amp
        var layout = {
            title: "Signal displayed here",
            font: { size: 18 },

            yaxis:{range:[-10, 10]},
            xaxis:{range:[-0.5, 6]}
            
        };
        await Plotly.animate(
        "plot1",
        {
            layout: layout,
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

    async change_freq(freq){
        let data = this.generate(this.amp, freq);
        this.freq = freq
        var layout = {
            title: "Signal displayed here",
            font: { size: 18 },
            yaxis:{range:[-11, 11]},
            xaxis:{range:[-0.5, 6]}
            
        };
        await Plotly.animate(
        "plot1",
        {
            layout: layout,
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

    sampling(samplingRate){
        let sampledX = [];
        let sampledY = [];
        // const exp = "amp * Math.sin(2*pi*x*f)";
        // let f = this.freq
        // let amp = this.amp
        // const pi =22/7
        let x = this.data[0].x
        let y =this.data[0].y
        let step = Math.floor((x.length / x[x.length-1])/samplingRate)
        for(let i=0; i<x.length; i+=step){
            
            sampledX.push(x[i])
            sampledY.push(y[i])
        }
        let data = [{x:sampledX, y:sampledY, type: "line", mode: 'markers'}]
        var layout = {
            title: "Signal displayed here",
            font: { size: 18 },
            yaxis:{range:[-11, 11]},
            xaxis:{range:[-0.5, 6]}}
        
            
        
        Plotly.animate(
        "plot2",
        {
            layout: layout,
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
}
