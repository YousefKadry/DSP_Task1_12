var exp = "Math.sin(x)";

// Generate values
var xValues = [];
var yValues = [];
for (var x = 0; x <= 10; x += 0.1) {
xValues.push(x);
yValues.push(eval(exp));
}

// Display using Plotly
var data = [{x:xValues, y:yValues, mode:"lines"}];
var layout = {

  title: 'Signal displayed here',

  font: {size: 18}

};


var config = {responsive: true}

Plotly.newPlot("myPlot", data, layout, config);

// Script for reloding the data
var slider = document.getElementById("myRange");
            var output = document.getElementById("demo");
            output.innerHTML = slider.value;

            slider.addEventListener('mouseup', function() {
                output.innerHTML = this.value;
                let amp = this.value
                var exp = "Math.sin(x)";

                // Generate values
                var nxValues = [];
                var nyValues = [];
                for (var x = 0; x <= 40; x += 0.1) {
                    nxValues.push(x);
                    nyValues.push(amp * eval(exp));
                  }
                var data = [{x:nxValues, y:nyValues, mode:"lines"}];
                var layout = {title: "y = " + exp,
                          xaxis: {
                                  autorange: true,
                                  autoscale: true},
                          yaxis: {
                              autorange: true,
                              autoscale: true}
                          }
              Plotly.animate("myPlot",{
                  data: data,
                  traces: [0],
                  layout: layout
              }, {
                transition: {
                duration: 500,
                easing: 'cubic-in-out'
                  },
                frame: {
                duration: 500
                }
              })
              Plotly.relayout( "myPlot", {
              'xaxis.autorange': true,
              'yaxis.autorange': true
              })
          })
