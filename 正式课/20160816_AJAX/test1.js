function sum() {
    var total = null;
    [].forEach.call(arguments, function (item) {
        item = Number(item);
        if (!isNaN(item)) {
            total += item;
        }
    });
    return total;
}
module.exports = {
    sum: sum
};
//module.exports.sum = sum;
//exports.sum = sum;