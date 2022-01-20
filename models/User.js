const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String },
    bio: { type: String },
    business: [{ type: Schema.Types.ObjectId, ref: 'Business' }],
    products: [{ type: Schema.Types.ObjectId, ref: 'Products' }]
});

UserSchema
    .virtual('url')
    .get(function () {
        return '/catalog/user/' + this._id;
    });

//Export user
module.exports = mongoose.model('User', UserSchema);
