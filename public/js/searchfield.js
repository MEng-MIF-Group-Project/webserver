var submit_button = document.getElementById("submitSearch");
var input_field = document.getElementById("inputPrimary");

submit_button.addEventListener("click", function(){
	//console.log(window.location.origin + "/calc/pre");
	window.location.replace(window.location.origin + "/calc/stoich/" + input_field.value)
});

