import express from 'express'
import BlogService from '../services/BlogService';
import CommentService from '../services/CommentService'
import { Authorize } from '../middleware/authorize.js'

let _blogService = new BlogService().repository
let _commentService = new CommentService().repository

export default class BlogController {
    constructor() {
        this.router = express.Router()
            //NOTE all routes after the authenticate method will require the user to be logged in to access
            .get('', this.getAll)
            .get('/:id', this.getById)
            .get('/:id/comments', this.getComment)
            .use(Authorize.authenticated)
            .post('', this.create)
            .put('/:id', this.edit)
            .delete('/:id', this.delete)
    }

    async getComment(req, res, next) {
        try {
            let data = await _commentService.find({ blogId: req.params.id }).populate('author', 'name')
            return res.send(data)
        } catch (error) { next(error) }
    }
    async getAll(req, res, next) {
        try {
            let data = await _blogService.find({ author: req.params.id })
                .populate('author', 'name') // <-- only return the Persons name
            //FIXME No []...https://mongoosejs.com/docs/2.7.x/docs/populate.html
            return res.send(data)
        } catch (error) { next(error) }

    }

    async getById(req, res, next) {
        try {
            let data = await _blogService.findById(req.params.id)
                .populate('author', 'name')
            if (!data) {
                throw new Error("Invalid Id")
            }
            res.send(data)
        } catch (error) { next(error) }
    }

    async create(req, res, next) {
        try {
            //NOTE the user id is accessable through req.body.uid, never trust the client to provide you this information
            req.body.author = req.session.uid
            let data = await _blogService.create(req.body)
            res.send(data)
        } catch (error) { next(error) }
    }

    async edit(req, res, next) {
        try {
            let data = await _blogService.findOneAndUpdate({ _id: req.params.id, author: req.session.uid }, req.body, { new: true })
                .populate('author', 'name')
            if (data) {
                return res.send(data)
            }
            throw new Error("invalid id")
        } catch (error) {
            next(error)
        }
    }

    async delete(req, res, next) {
        try {
            let data = await _blogService.findOneAndRemove({ _id: req.params.id, author: req.session.uid })
            if (!data) {
                throw new Error("invalid id, you didn't say the magic word")
            }
            res.send("deleted")
        } catch (error) { next(error) }

    }

}