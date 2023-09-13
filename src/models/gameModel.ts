import { bool } from "joi"

const mongoose = require('mongoose')

const gameSchema = new mongoose.Schema({
    started: Boolean
})

const Game = mongoose.model('Game', gameSchema)

module.exports = Game