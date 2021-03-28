module.exports = function (callback, x, y) {
    var result = "Result from Server:" + x * y;
    callback(null, result);

}
