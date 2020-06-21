const mongoose = require('mongoose')
const Schema = mongoose.Schema

const groupSchema = new Schema(
    {
        name: String,
        desc: String,
        users: [String],
    },
    {
        collection: 'groups'
    }
)

module.exports = mongoose.model('Group', groupSchema)