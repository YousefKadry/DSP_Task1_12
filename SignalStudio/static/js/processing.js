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
        this.generate(amp, freq);
        const data1 = sin_wave.generate(1, 0.5);
        Plotly.newPlot("myPlot", data1, this.layout, this.config);
    }


    change_amp(amp) {
        let data = this.generate(amp, this.freq);
        this.amp = amp
        var layout = {
            title: "Signal displayed here",
            font: { size: 18 },
            yaxis:{range:[-10, 10]}
            
        };
        Plotly.animate(
        "myPlot",
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

    change_freq(freq){
        let data = this.generate(this.amp, freq);
        this.freq = freq
        var layout = {
            title: "Signal displayed here",
            font: { size: 18 },
            yaxis:{range:[-10, 10]}
            
        };
        Plotly.animate(
        "myPlot",
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
