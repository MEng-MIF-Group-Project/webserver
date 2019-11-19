var slider = document.getElementById("sample-range");
var output = document.getElementById("sample-range-value");
output.innerHTML = slider.value;

slider.oninput = function() {
  output.innerHTML = this.value;
}