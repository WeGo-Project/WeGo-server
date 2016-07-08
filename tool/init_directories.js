var fs = require("fs");

fs.mkdir("./data", function (err) {
    if (err) {
        console.log(err);
    }
    fs.mkdir("./data/uploaded/", function (err) {
        if (err) {
            console.log(err);
        }
        fs.mkdir("./data/uploaded/finished/", function (err) {
            if (err) {
                console.log(err);
            }
        });

        fs.mkdir("./data/uploaded/tmp/", function (err) {
            if (err) {
                console.log(err);
            }
        });
    });
});
