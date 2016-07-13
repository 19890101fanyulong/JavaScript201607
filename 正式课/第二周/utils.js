/**
 * Created by lucky on 2016/7/13.
 */
var utils = {
    listToArray: function (likeArray) {
        try {
            return Array.prototype.slice.call(likeArray);
        } catch (e) {
            var a = [];
            for (var i = 0; i < likeArray.length; i++) {
                a[a.length] = likeArray[i];
            }
            return a;
        }
    },
    jsonParse: function (jsonStr) {
        return "JSON" in window ? JSON.parse(jsonStr) : eval("(" + jsonStr + ")");
    }
};
