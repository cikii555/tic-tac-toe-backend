"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const router = express.Router();
const Game = require('../models/gameModel');
const Events = require('events');
const { v4: uuidv4 } = require('uuid');
const io = require('../models/socketcommunication').get();
const players = {};
const games = {};
router.get('/single-player', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let game = new Game({
        started: true,
        turn: true
    });
    game.save();
    res.send(game);
}));
router.get('/multiplayer', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    io.on('gameCreated', () => {
        console.log("hdasjhskdas");
    });
    const game = new Game({
        started: false,
        players: 1,
        turn: true
    });
    yield game.save();
    res.send(game._id);
}));
router.post('/join-game', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let game = yield Game.findOne({ _id: req.body.id });
    if (game.players === 2) {
        res.send('You cant join game');
    }
    game.started = true;
    game.players = 2;
    yield game.save();
    io.emit('gameStarted');
    res.send(game);
}));
module.exports = router;
