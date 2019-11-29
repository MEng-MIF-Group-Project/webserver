if (diagramType == 3) {
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
				var value;
				if (largestScore == lowestScore) {
					value = 1;
				}
				else {
					value = (1 / (largestScore - lowestScore)) * (d.label - lowestScore);
				}
				var colour  = new RGBColour(0, 0, 0, value);
				return colour.getRGB();
			}),
			size: 14,
			line: { width: 2 }
		},
	};

	var data = [trace2];
	var layout = {
		ternary: {
			sum: 100,
			aaxis: makeAxis(axisNames[0], 0),
			baxis: makeAxis('<br>' + axisNames[1], 0),
			caxis: makeAxis('<br>' + axisNames[2], 0),
			bgcolor: 'rgba(0,0,0,0)'
		},
		paper_bgcolor: 'rgba(0,0,0,0)',
		showlegend: true,
		//hovermode: !1
	};

	Plotly.plot('diagram', data, layout, {
		displayModeBar: false
	});
}
else if (diagramType == 10) {
	var trace1 = {
		x: rawData.map(function(d) { return d.A; }),
		y: rawData.map(function(d) { return d.B; }),
		z: rawData.map(function(d) { return d.C; }),
		mode: 'markers',
		marker: {
			size: 12,
			line: {
				color: 'rgba(217, 217, 217, 0.14)',
				width: 0.5
			},
			opacity: 0.8
		},
		type: 'scatter3d'
	};


	var data = [trace1];
	var layout = {
		margin: {
			l: 0,
			r: 0,
			b: 0,
			t: 0
		},
		paper_bgcolor:"#fffcfb",
		scene: {
			xaxis: {
				title: {
					text: axisNames[0],
					font: {
						family: 'Courier New, monospace',
						size: 18,
						color: '#7f7f7f'
					}
				},
			},
			yaxis: {
				title: {
					text: axisNames[1],
					font: {
						family: 'Courier New, monospace',
						size: 18,
						color: '#7f7f7f'
					}
				},
			},
			zaxis: {
				title: {
					text: axisNames[2],
					font: {
						family: 'Courier New, monospace',
						size: 18,
						color: '#7f7f7f'
					}
				},
			}
		}
	};

	Plotly.newPlot('diagram', data, layout, {
		displayModeBar: false
	});
}


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
