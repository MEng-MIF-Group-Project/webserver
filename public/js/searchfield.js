
$( document ).ready(function() {
	var submit_button = document.getElementById("submitSearch");
	var input_field = document.getElementById("inputPrimary");
	var precursorsList = document.getElementById("precursors-list");
	var pointsCount = document.getElementById("sample-range-value");
	var margin = document.getElementById("margin-range-value");

	var cache;

	submit_button.addEventListener("click", function(){
		pointsCount = parseInt(pointsCount.textContent);
		margin = parseFloat(margin.textContent);

		var activePrecursors = [];

		for (var i = 0; i < precursorsList.children.length; i++) {
			if (precursorsList.children[i].classList.contains("active")) {
				activePrecursors.push(precursorsList.children[i]);
			}
		}

		var marginPointsString = pointsCount.toString() + "-" + margin.toString();

		if (activePrecursors.length != 0) {
			var queryPrecursor = "";
			for (var i = 0; i < activePrecursors.length - 1; i++) {
				queryPrecursor = queryPrecursor + activePrecursors[i].textContent + "-";
			}
			queryPrecursor = queryPrecursor + activePrecursors[activePrecursors.length - 1].textContent;

			console.log(queryPrecursor);

			//console.log(window.location.origin + "/calc/pre");
			window.location.replace(window.location.origin + "/calc/pre/" + marginPointsString + "/" + input_field.value + "/" + queryPrecursor);
		}
		else {
			window.location.replace(window.location.origin + "/calc/stoich/" + marginPointsString + "/" + input_field.value);
		}
		
		cache=queryPrecursor;
		input_field.textContent = cache;
	});
});