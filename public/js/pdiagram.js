var rawData = [
	{A:75,B:25,C:0, label:'point 1'},
	{A:73,B:10,C:20,label:'point 2'},
	{A:75,B:20,C:5, label:'point 3'},
	{A:5, B:60,C:35,label:'point 4'},
	{A:10,B:80,C:10,label:'point 5'},
	{A:10,B:90,C:0, label:'point 6'},
	{A:20,B:70,C:10,label:'point 7'},
	{A:10,B:20,C:70,label:'point 8'},
	{A:15,B:5, C:80,label:'point 9'},
	{A:10,B:10,C:80,label:'point 10'},
	{A:20,B:10,C:70,label:'point 11'},
];

var trace1 = {
	name: 'known',
	type: 'scatterternary',
	mode: 'markers',
	a: rawData.map(function(d) { return d.A; }),
	b: rawData.map(function(d) { return d.B; }),
	c: rawData.map(function(d) { return d.C; }),
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
		color: '#DB7365',
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