import { Request, Response } from "express"
const express = require('express')
const router = express.Router()
const Game = require('../models/gameModel')
const Events = require('events')
const { v4: uuidv4 } = require('uuid');
const io = require('../models/socketcommunication').get();

const players: { [key: string]: any } = {}
const games: { [key: string]: any } = {};

router.get('/single-player', async (req: Request, res: Response) => {
    let game = new Game({
        started: true,
        turn: true
    })
    game.save()
    res.send(game)

})


router.get('/multiplayer', async (req: Request, res: Response) => {
    io.on('gameCreated', () => {
        console.log("hdasjhskdas")
    })
    const game = new Game({
        started: false,
        players: 1,
        turn: true
    });
    await game.save()
    res.send(game._id)
})

router.post('/join-game', async (req: Request, res: Response) => {
    let game = await Game.findOne({ _id: req.body.id })
    if (game.players === 2) {
        res.send('You cant join game')
    }

    game.started = true
    game.players = 2
    await game.save()
    io.emit('gameStarted')
    res.send(game)

});


module.exports = router

