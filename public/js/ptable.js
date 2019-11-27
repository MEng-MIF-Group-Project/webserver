var chips = document.getElementsByClassName("chip");
var input_field = document.getElementById("inputPrimary");

for (var i = 0; i < chips.length; ++i) {
	chips[i].addEventListener("click", function() {
		this.firstChild.classList.toggle("active");
		if (this.firstChild.classList.contains("active")) {
			if(String(input_field.value) != "") 
				input_field.value = input_field.value + "-" + this.firstChild.lastChild.textContent;
			else {
				input_field.value = this.firstChild.lastChild.textContent;
			}
		} else {
			var value_string = String(input_field.value);
			var old_string = String(this.firstChild.lastChild.textContent);
            
            if (value_string == old_string){
                value_string = "";
            } else if (value_string.startsWith(old_string + "-")) {
                value_string = value_string.replace(old_string + "-", "");
			} else if (value_string.endsWith("-" + old_string)) {
                value_string = value_string + "@egaega@@rwssh@@";
				value_string = value_string.replace("-" + old_string + "@egaega@@rwssh@@", "");
			} else {
                value_string = value_string.replace("-" + old_string + "-", "-");
            }
			input_field.value = value_string;
		} 
	});
    
}

input_field.addEventListener("input", function(){
    var s = String(input_field.value).toLowerCase();
    var ar = [];
    var cur = "";
    var count = 0;
    for (var i = 0; i < s.length; i++){
        if (s.charAt(i) != "-"){
            cur = cur + s.charAt(i);
        }
        if (s.charAt(i) == "-" || i + 1 == s.length){
            ar[count] = cur.toLowerCase();
            count += 1;
            cur = "";
        }
    }
    
    for (var i = 0; i < chips.length; i++){
        chips[i].firstChild.classList.toggle("active", false);
        for (var j = 0; j < count; j++){
            if (ar[j] == String(chips[i].firstChild.lastChild.textContent).toLowerCase()){
                chips[i].firstChild.classList.toggle("active", true);
            }
        }
    }
    });
    
 