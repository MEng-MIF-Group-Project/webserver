var stoichs = document.getElementsByClassName("stoich-result");

var submit_button = document.getElementById("submitSearch");
var input_field = document.getElementById("inputPrimary");
var precursorsList = document.getElementById("precursors-list");
var pointsCount = document.getElementById("sample-range-value");
var margin = document.getElementById("margin-range-value");

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
    stoichs[i].classList.add("btn");
    stoichs[i].addEventListener("click", function() {
        pointsCount = parseInt(pointsCount.textContent);
        margin = parseFloat(margin.textContent);
        
        var activePrecursors = [];

		for (var i = 0; i < precursorsList.children.length; i++) {
			if (precursorsList.children[i].classList.contains("active")) {
				activePrecursors.push(precursorsList.children[i]);
			}
		}

        var marginPointsString = pointsCount.toString() + "-" + margin.toString();
        var re = /[A-Z][a-z]?/g;
        var s = this.textContent.toString();
        var hs = this.textContent.toString();
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

        if (activePrecursors.length != 0) {
			var queryPrecursor = "";
			for (var i = 0; i < activePrecursors.length - 1; i++) {
				queryPrecursor = queryPrecursor + activePrecursors[i].textContent + "-";
			}
			queryPrecursor = queryPrecursor + activePrecursors[activePrecursors.length - 1].textContent;

			console.log(queryPrecursor);



            
			//console.log(window.location.origin + "/calc/pre");
			window.location.replace(window.location.origin + "/calc/pre/" + marginPointsString + "/" + hs + "/" + queryPrecursor);
		}
    });


}