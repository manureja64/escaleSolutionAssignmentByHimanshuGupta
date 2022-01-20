const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ProductsSchema = new Schema({
    name: { type: String, required: true },
    mrp: { type: Number },
    description: { type: String },
    business: { type: Schema.Types.ObjectId, ref: 'Business' },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
});

ProductsSchema
    .virtual('url')
    .get(function () {
        return '/catalog/products/' + this._id;

    });

//Export Products
module.exports = mongoose.model('Products', ProductsSchema);
