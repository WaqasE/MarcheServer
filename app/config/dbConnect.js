const mongoose = require('mongoose');
module.exports = mongoose.connect(process.env.DBCONNECT)
    .then(() => {
        console.info(('Connected to database!'));
    })
    .catch((err) => {
        console.error(err);
    })