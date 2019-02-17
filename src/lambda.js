"use strict";
exports.__esModule = true;
var google_verify_1 = require("./google-verify");
google_verify_1["default"].isGoogleIp('66.249.66.1').then(function (a) {
    console.log('asdasd', a);
})["catch"](function (e) {
    console.error(e);
});
