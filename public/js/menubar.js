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


var options_toggle = document.getElementById("options_toggle");
var options_menu = document.getElementById("options_menu");
var op_toggle = true;

options_toggle.addEventListener("click", function() {
	op_toggle = !op_toggle;
	//console.log(pt_section);
	options_menu.style.display = op_toggle ? "none" : "block";
  options_toggle.checked = op_toggle;

  var precursor_scroll = document.getElementById("precursor-scroll");
  precursor_scroll.style.height = op_toggle ? "510" : "275";
});
