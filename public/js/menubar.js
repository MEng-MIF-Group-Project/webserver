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

var maxHeight = 510;
var minHeight = 275;
var precursorHeight = 46;

var mass_toggle = document.getElementById("mass_checkbox");
var prop_toggle = document.getElementById("prop_cbeckbox");

var ma_toggle = true;
var pr_toggle = false;

options_toggle.addEventListener("click", function() {
	op_toggle = !op_toggle;
	//console.log(pt_section);
	options_menu.style.display = op_toggle ? "none" : "block";
  options_toggle.checked = op_toggle;

  var precursor_scroll = document.getElementById("precursor-scroll");
  var height = 1 + document.getElementById("precursors-list").children.length * precursorHeight;
  if (height <= maxHeight) {
    precursor_scroll.style.height = op_toggle ? height.toString() : "275";
  } else {
    precursor_scroll.style.height = op_toggle ? "510" : "275";
  }
});

mass_toggle.addEventListener("click", function() {
  ma_toggle = !ma_toggle;

  mass_toggle.checked = ma_toggle;
});

prop_toggle.addEventListener("click", function() {
  pr_toggle = !pr_toggle;

  prop_toggle.checked = pr_toggle;
});