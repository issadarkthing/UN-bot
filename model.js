const mongoose = require('mongoose');

const schema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    owner : String,
    prefix : String,
    boost_channel : String,
    id : String
});

module.exports = mongoose.model('UNserver', schema);