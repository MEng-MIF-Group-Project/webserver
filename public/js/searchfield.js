
$( document ).ready(function() {
	var submit_button = document.getElementById("submitSearch");
	var input_field = document.getElementById("inputPrimary");

	var precursorsList = document.getElementById("precursors-list");

	if (precursorsList == null) {
		precursorsList = -1;
	}

	var pointsCount = document.getElementById("sample-range-value");

	var propCheckBox = document.getElementById("prop_cbeckbox");
	var massCheckBox = document.getElementById("mass_checkbox");

	var quantity = document.getElementById("desired_quantity");


	var cache;
	submit_button.addEventListener("click", function(){
		pointsCount = parseInt(pointsCount.textContent);
		var propMassString = (!propCheckBox.checked).toString() + "-" + (!massCheckBox.checked).toString() + "-" + parseFloat(quantity.value); 

		var activePrecursors = [];
		if (precursorsList != -1) {
			for (var i = 0; i < precursorsList.children.length; i++) {
				if (precursorsList.children[i].classList.contains("active")) {
					activePrecursors.push(precursorsList.children[i]);
				}
			}
		}

		var pointsString = pointsCount.toString()

		if (activePrecursors.length != 0) {
			var queryPrecursor = "";
			for (var i = 0; i < activePrecursors.length - 1; i++) {
				queryPrecursor = queryPrecursor + activePrecursors[i].textContent + "-";
			}
			queryPrecursor = queryPrecursor + activePrecursors[activePrecursors.length - 1].textContent;

			console.log(queryPrecursor);

			//console.log(window.location.origin + "/calc/pre");
			window.location.replace(window.location.origin + "/calc/pre/" + pointsString + "/" + input_field.value + "/" + queryPrecursor + "/" + propMassString);
		}
		else {
			window.location.replace(window.location.origin + "/calc/stoich/" + pointsString + "/" + input_field.value + "/" + propMassString);
		}

		cache=queryPrecursor;
		input_field.textContent = cache;
	});
});
