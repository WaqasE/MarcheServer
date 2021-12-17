const { User, Gig } = require('../models/');
const _ = require('lodash');

class GigController {
    constructor() {
    }

    async create(req, res) {
        const data = _.pick(req.body, ['title', 'description', 'user', 'thumbnail']);
        const gig = await new Gig({ title: data.title, description: data.description, user: data.user, thumbnail: data.thumbnail, })
        await gig.save();
        return res.status(200).send({ Gig: gig });
    }
    async addTags(req, res) {
        const data = _.pick(req.body, ['id', 'tags']);
        const gig = await Gig.findById(data.id);
        gig.tags = data.tags;
        await gig.save();
        return res.status(200).send('Tags updated succesfully');
    }
    async update(req, res, next) { }

    async get(req, res) {
        const gigs = await Gig.find({
            'tags': { $in: req.body.tags }
        })
        return res.status(200).send({ Gigs: gigs });
    }
    async delete(req, res, next) { }
    async createBid(req, res, next) { }
    async deleteBid(req, res, next) { }
}
module.exports = GigController = new GigController();