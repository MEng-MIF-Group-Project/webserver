var trace1 = {
	name: 'known',
	type: 'scatterternary',
	mode: 'markers',
	//a: rawData.map(function(d) { return d.A; }),
	//b: rawData.map(function(d) { return d.B; }),
	//c: rawData.map(function(d) { return d.C; }),
	text: rawData.map(function(d) { return d.label; }),
	marker: {
		symbol: 100,
		color: '#DB7365',
		size: 14,
		line: { width: 2 }
	},
};

var trace2 = {
	name: 'calculated',
	type: 'scatterternary',
	mode: 'markers',
	a: rawData.map(function(d) { return d.A; }),
	b: rawData.map(function(d) { return d.B; }),
	c: rawData.map(function(d) { return d.C; }),
	text: rawData.map(function(d) { return d.label; }),
	marker: {
		symbol: 100,
		color: rawData.map(function(d) {
			var value = (1 - (d.label / 255)) * 255;
			var colour  = new RGBColour(value, value, value, 1);			
			return colour.getRGB();
		}),
		size: 14,
		line: { width: 2 }
	},
};

var data = [trace1, trace2];
var layout = {
	ternary: 
	{
		sum: 100,
		aaxis: makeAxis('A', 0),
		baxis: makeAxis('<br>B', 45),
		caxis: makeAxis('<br>C', -45),
		bgcolor: 'rgba(0,0,0,0)'
	},
	paper_bgcolor: 'rgba(0,0,0,0)',
	showlegend: true,
	//hovermode: !1
};

Plotly.plot('diagram', data, layout, {
	displayModeBar: false
});

function makeAxis(title, tickangle) {
	return {
	  title: title,
	  titlefont: { size: 20 },
	  tickangle: tickangle,
	  tickfont: { size: 15 },
	  tickcolor: 'rgba(0,0,0,0)',
	  ticklen: 5,
	  showline: true,
	  showgrid: true
	};
}