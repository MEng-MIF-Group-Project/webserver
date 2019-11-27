var precursorslist = document.getElementById("precursors-list");
var pl_toggle = [];

for (var i = 0; i < precursorslist.children.length; ++i) {
    precursorslist.children.item(i).addEventListener("click", function() {
        this.classList.toggle("active");
    });
}

var precursortxtfield = document.getElementById("precursor-add").firstChild;
var precursorbutton = document.getElementById("precursor-add-bttn");

var maxHeight = 510;
var minHeight = 275;
var precursorHeight = 46;

precursorbutton.addEventListener("click", function() {
    var temp = document.createElement('button');
    temp.innerHTML = precursorslist.children.item(0).innerHTML;
    temp.classList = precursorslist.children.item(0).classList;
    temp.classList.remove('active');
    temp.id = precursorslist.children.length+1;
    temp.textContent = precursortxtfield.value;

    document.getElementById("precursors-list").firstChild.before(temp);

    precursorslist.firstChild.addEventListener("click", function() {
        this.classList.toggle("active");
    });

    var options_toggle = document.getElementById("options_toggle");
    if (options_toggle.checked == true) {
        var precursor_scroll = document.getElementById("precursor-scroll");
        var height = 1 + document.getElementById("precursors-list").children.length * precursorHeight;
        if (height <= maxHeight) {
            precursor_scroll.style.height = op_toggle ? height.toString() : "275";
        } else {
            precursor_scroll.style.height = op_toggle ? "510" : "275";
        }
    } 
    

});
