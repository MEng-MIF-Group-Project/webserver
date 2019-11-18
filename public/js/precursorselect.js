var precursorslist = document.getElementById("precursors-list");
var pl_toggle = [];

for (var i = 0; i < precursorslist.children.length; ++i) {
    precursorslist.children.item(i).addEventListener("click", function() {
        this.classList.toggle("active");
    });
}
