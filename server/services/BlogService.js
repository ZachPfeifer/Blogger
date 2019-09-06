import mongoose from "mongoose"
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const _model = new Schema({
    title: { type: String, max: 60, required: true },
    summary: { type: String, max: 120, required: true },
    author: {},
    authorId: { type: ObjectId, ref: 'User', required: true },
    //FIXME New Service for this \/
    img: { type: String, default: 'https://placeold.it/200x200' },
    body: { type: String }
}, { timestamps: true })


// {
//     title: "The Era of E-Sports" //max length should be 60 characters
//     summary: "A short description." // no more than 120 characters
//     author: { // How could this data get.... populated 
//         _id: "12lkj3lkj24ljhlkj23lj231klf",
//             name: "Jim Bob"
//     },
//     img: "https://placehold.it"
//     body: "A bunch of stuff about E-Sports", 
// }

// timestamps: true

export default class BlogService {
    get repository() {
        return mongoose.model('value', _model)
    }
}