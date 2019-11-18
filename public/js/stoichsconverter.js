const gcd = (a,b) => a ? gcd(b % a, a) : b;
const lcm = (a, b) => a * b / gcd(a, b);

function toFormulae(points, size) {
    console.log(points);
    console.log(size);
    var formulae = [];
    //for (var j = 0; j < points.length; ++j) {
        //const min = Math.min(...points[j]);
        //formulae[j] = points[j].map(x => x / min);
    //}

    for (var i=0; i<points.length;) {
        var arr = Array();
        for (var j=0; j<size;++j) {
            arr.push(points[i++]);
        }
        const min = Math.min.apply(null, arr.filter(Boolean));
        arr = arr.map(x => Math.round(x / min));
        formulae.push(arr);
    }

    console.log(formulae)
    //return formulae;
}