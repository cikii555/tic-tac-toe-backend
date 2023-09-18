import { bool } from "joi"

const mongoose = require('mongoose')

const gameSchema = new mongoose.Schema({
    started: Boolean,
    players : Number,
    turn : Boolean,
    type: String,
})

const Game = mongoose.model('Game', gameSchema)

module.exports = Game