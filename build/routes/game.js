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
const myEmitter = new Events();
const { v4: uuidv4 } = require('uuid');
const socketIO = require('socket.io');
const io = require('../app');
const players = {};
const games = {};
router.get('/single-player', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let game = new Game({
        started: true
    });
    game.save();
    res.send(game);
}));
router.get('/multiplayer', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const game = new Game({
            started: false
        });
        yield game.save();
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.write(`data: ${JSON.stringify({ gameId: game._id, started: false })}\n\n`);
        const intervalId = setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
            const updatedGame = yield Game.findById(game._id);
            if (updatedGame.started) {
                clearInterval(intervalId);
                res.write(`data: ${JSON.stringify({ started: true })}\n\n`);
            }
        }), 1000);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error creating the game');
    }
}));
router.post('/join-game', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let game = yield Game.findOne({ _id: req.body.id });
    game.started = true;
    game.save();
    res.send("pocea igra");
    res.send(game);
}));
module.exports = router;
