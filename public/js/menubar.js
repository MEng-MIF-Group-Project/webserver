var slider1 = document.getElementById("margin-range");
var output1 = document.getElementById("margin-range-value");
output1.innerHTML = slider1.value;

slider1.oninput = function() {
  output1.innerHTML = this.value;
}

var slider2 = document.getElementById("sample-range");
var output2 = document.getElementById("sample-range-value");
output2.innerHTML = slider2.value;

slider2.oninput = function() {
  output2.innerHTML = this.value;
}