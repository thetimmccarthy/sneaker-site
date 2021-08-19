var mongoose = require('mongoose');

const Schema = mongoose.Schema;

const brandSchema = new Schema({
    name: {type: String, required: true},
    headquarters: String,
    desc: String
});

//  TODO: make sure this has correct URL
brandSchema.virtual('url').get(() => {
    return 'brand/' + this._id;
});

const brandModel = mongoose.model('Brand', brandSchema);

module.exports = brandModel;
