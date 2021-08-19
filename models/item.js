var mongoose = require('mongoose')
mongoose.set('useFindAndModify', false);
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    name: {type: String, required: true},
    desc: {type: String, required: true}, 
    category: {type: Schema.Types.ObjectId, ref: 'Category', required: true},
    brand: {type: Schema.Types.ObjectId, ref: 'Brand', required: true},
    price: Number,
    size: {type: Number, required: true},
    likes: {type: Number, default: 0},
    owner: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    picture: String
});

//  TODO: make sure this has correct URL
itemSchema.virtual('url').get(() => {
    return 'item/' + this._id;
})

const itemModel = mongoose.model('Item', itemSchema);

module.exports = itemModel;

