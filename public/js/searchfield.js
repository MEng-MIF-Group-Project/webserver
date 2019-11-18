var submit_button = document.getElementById("submitSearch");
var input_field = document.getElementById("inputPrimary");

window.post = function(url, data) {
  return fetch(url, {method: "POST", body: JSON.stringify(data)});
}

submit_button.addEventListener("click", function(){
	
});

