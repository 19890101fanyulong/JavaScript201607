var test1 = require("./test1");
function avg() {
    var total = test1.sum.apply(null, arguments);
    return total / arguments.length;
}
exports.avg = avg;