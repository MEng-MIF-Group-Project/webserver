var pt_icon = document.getElementsByClassName("pt-icon")[0];
var pt_toggle = false;

pt_icon.addEventListener("click", function() {
	var pt_section = document.getElementById("pt-section");
	pt_toggle = !pt_toggle;
	console.log(pt_section);
	pt_section.style.display = pt_toggle ? "none" : "block";
});
