var stoichs = document.getElementsByClassName("stoich-result");

var submit_button = document.getElementById("submitSearch");
var input_field = document.getElementById("inputPrimary");
var precursorsList = document.getElementById("precursors-list");
var pointsCount = document.getElementById("sample-range-value");

var propCheckBox = document.getElementById("prop_cbeckbox");
var massCheckBox = document.getElementById("mass_checkbox");

const VALID_ELEMENTS = [
	"H","He","Li","Be","B","C","N","O","F","Ne","Na","Mg","Al","Si","P","S","Cl","Ar",
	"K","Ca","Sc","Ti","V","Cr","Mn","Fe","Co","Ni","Cu","Zn","Ga","Ge","As","Se","Br","Kr",
	"Rb","Sr","Y","Zr","Nb","Mo","Tc","Ru","Rh","Pd","Ag","Cd","In","Sn","Sb","Te","I","Xe",
	"Cs","Ba","La","Hf","Ta","W","Re","Os","Ir","Pt","Au","Hg","Tl","Pb","Bi","Po","At","Rn",
	"Fr","Ra","Ac","Rf","Db","Sg","Bh","Hs","Mt","Ds","Rg","Cn","Nh","Fl","Mc","Lv","Ts","Og",
	"La","Ce","Pr","Nd","Pm","Sm","Eu","Gd","Tb","Dy","Ho","Er","Tm","Yb","Lu",
	"Ac","Th","Pa","U","Np","Pu","Am","Cm","Bk","Cf","Es","Fm","Md","No","Lr"
]

for (var i = 0; i < stoichs.length; ++i) {
    var el = document.createElement("button");
    el.style.width = "36px";
    el.style.height = "28px";
    el.style.cssFloat = "right";
    el.classList.add("btn");
    el.classList.add("text-right");
    el.textContent = " ";
    stoichs[i].appendChild(el);
	//stoichs[i].classList.add("btn");
	el.addEventListener("click", function() {
		var propMassString = (!propCheckBox.checked).toString() + "-" + (!massCheckBox.checked).toString()
		pointsCount = parseInt(pointsCount.textContent);

		var activePrecursors = [];

		for (var i = 0; i < precursorsList.children.length; i++) {
			if (precursorsList.children[i].classList.contains("active")) {
				activePrecursors.push(precursorsList.children[i]);
			}
		}

        var re = /[A-Z][a-z]?/g;
        //console.log(this.parentNode.textContent.toString());
		var s = this.parentNode.textContent.toString();
		var hs = this.parentNode.textContent.toString();
		//var m;

		String.prototype.splice = function(idx, rem, str) {
			return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
		};
		var indices = [];
		do {
			var m = re.exec(s);
			console.log(m);
			if (m) {
				if (m.index != 0) {
					indices.push(m.index);
                    //hs = hs.splice(m.index, 0, "-");
				}
			}
		} while (m);

		for (var j = indices.length - 1; j >= 0; j--) {
			hs = hs.splice(indices[j], 0, "-");
		}
        
        console.log("Returned string: " + hs);

		if (activePrecursors.length != 0) {
			var queryPrecursor = "";
			for (var i = 0; i < activePrecursors.length - 1; i++) {
				queryPrecursor = queryPrecursor + activePrecursors[i].textContent + "-";
			}
			queryPrecursor = queryPrecursor + activePrecursors[activePrecursors.length - 1].textContent;

			//console.log(queryPrecursor);

			//console.log(window.location.origin + "/calc/pre");
			window.location.replace(window.location.origin + "/calc/pre/" + pointsCount.toString() + "/" + hs + "/" + queryPrecursor + "/" + propMassString);
		}
	});
}
