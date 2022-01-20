const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BusinessSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String },
    registrationNo: { type: Number },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    //Each business is a collection of products
    product: [{ type: Schema.Types.ObjectId, ref: 'Products' }]
});

BusinessSchema
    .virtual('url')
    .get(function () {
        return '/catalog/business/' + this._id;
    });

//Export model
module.exports = mongoose.model('Business', BusinessSchema);