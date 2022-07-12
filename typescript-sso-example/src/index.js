var express = require('express');
var router = require('./routes/index');
var path = require('path');
var app = express();
var port = 3000;
app.use("/", router);
app.use(express.static(path.join(__dirname)));
// start the Express server
app.listen(port, function () {
    // tslint:disable-next-line:no-console
    console.log("server started at ".concat(port));
});
