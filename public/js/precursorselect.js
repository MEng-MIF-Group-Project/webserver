var precursorslist = document.getElementById("precursors-list");
var pl_toggle = [];

for (var i = 0; i < precursorslist.children.length; ++i) {
    precursorslist.children.item(i).addEventListener("click", function() {
        this.classList.toggle("active");
    });
}

var precursortxtfield = document.getElementById("precursor-add").firstChild;
var precursorbutton = document.getElementById("precursor-add-bttn");

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

});
