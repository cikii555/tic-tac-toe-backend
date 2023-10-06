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
const express = require("express");
const router = express.Router();
const Game = require("../models/gameModel");
const { winningMove } = require("../models/board");
const { v4: uuidv4 } = require("uuid");
const io = require("../models/socketcommunication").get();
const { boardTicTacToe } = require("../models/board");
const players = {};
const games = {};
const playerMoves = [];
io.on("connect", function (socket) {
    socket.on("make.it.work", (data) => {
        console.log(data);
        console.log("usao ovde");
        socket.join(data.id.toString());
    });
    socket.on("make.move", (data) => __awaiter(this, void 0, void 0, function* () {
        console.log(data);
        console.log(games[data.gameId].players);
        socket.join(data.gameId.toString());
        const foundGame = games[data.gameId];
        console.log(foundGame);
        //console.log(foundGame.dashboard);
        /*if (calculateTie(foundGame.dashboard)) {
          socket.emit("tie", games[data.gameId].dashboard);
          socket.to(data.gameId).emit("tie", games[data.gameId].dashboard);
        } else if (winningMove(foundGame.dashboard) != " ") {
          if (winningMove(data.dashboard) === "X") {
            socket.to(data.gameId).emit("x_win", games[data.gameId].dashboard);
          } else {
            socket.to(data.gameId).emit("o_win", games[data.gameId].dashboard);
          }
        }*/
        var game = yield Game.findOne({ _id: data.gameId });
        getPlayerMove(data.type, data.row, data.col, game, foundGame.dashboard);
    }));
    function getPlayerMove(type, row, column, game, dashboard) {
        return __awaiter(this, void 0, void 0, function* () {
            if (type == "SINGLE_PLAYER") {
                if (dashboard[row][column] === " ") {
                    dashboard[row][column] = "X";
                    playerMoves.push({ row, column });
                }
                const emptyPositions = [];
                for (let row = 0; row < dashboard.length; row++) {
                    for (let col = 0; col < dashboard[row].length; col++) {
                        if (dashboard[row][col] === " ") {
                            emptyPositions.push({ row, col });
                        }
                    }
                }
                const randomIndex = Math.floor(Math.random() * emptyPositions.length);
                const randomPosition = emptyPositions[randomIndex];
                dashboard[randomPosition.row][randomPosition.col] = "O";
                io.in(game._id.toString()).emit("move.made", {
                    dashboard: games[game._id].dashboard,
                    gameId: game._id,
                });
                game.turn = !game.turn;
            }
            else {
                if (game.turn) {
                    makeMove(row, column, "X", game, dashboard);
                }
                else {
                    makeMove(row, column, "O", game, dashboard);
                }
            }
        });
    }
    function move(game, dashboard) {
        return __awaiter(this, void 0, void 0, function* () {
            const emptyPositions = [];
            for (let row = 0; row < dashboard.length; row++) {
                for (let col = 0; col < dashboard[row].length; col++) {
                    if (dashboard[row][col] === " ") {
                        emptyPositions.push({ row, col });
                    }
                }
            }
            const randomIndex = Math.floor(Math.random() * emptyPositions.length);
            const randomPosition = emptyPositions[randomIndex];
            dashboard[randomPosition.row][randomPosition.col] = "O";
            io.in(game._id).emit("move.made.random", {
                dashboard: games[game._id].dashboard,
                gameId: game._id,
            });
            game.turn = !game.turn;
            yield game.save();
        });
    }
    function makeMove(row, col, symbol, game, dashboard) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("ovde si");
            if (dashboard[row][col] == " ") {
                dashboard[row][col] = symbol;
                playerMoves.push({ row, col });
            }
            io.in(game._id.toString()).emit("move.made", {
                dashboard: games[game._id].dashboard,
                gameId: game._id,
            });
            game.turn = !game.turn;
            yield game.save();
            return dashboard;
        });
    }
    function calculateTie(board) {
        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board[row].length; col++) {
                if (board[row][col] === " ") {
                    return false;
                }
            }
            return true;
        }
    }
    function resetBoardTicTacToe(board) {
        for (let row = 0; row <= board.length; row++) {
            for (let col = 0; col < board[row].length; col++) {
                boardTicTacToe[row][col] = " ";
            }
        }
    }
});
/*io.on("disconnect", function () {
    
    if (io.room != null) {
        io.emit("quit");
        io.in(io.room.toString()).emit("quit");
        delete games[io.room];
    }
});*/
router.get("/single-player", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let game = new Game({
        started: true,
        turn: true,
        type: "SINGLE_PLAYER",
    });
    game.save();
    res.send(game);
    const ioEmitter = req.app.get("socketIO");
    const mapKeys = Array.from(ioEmitter.sockets.sockets.keys());
    const activeSocket = getActiveSocket(ioEmitter.sockets.sockets);
    function getActiveSocket(sockets) {
        const lastElement = mapKeys[mapKeys.length - 1];
        const socket = sockets.get(lastElement);
        if (socket.connected) {
            return socket;
        }
        return null;
    }
    const board = [
        [" ", " ", " "],
        [" ", " ", " "],
        [" ", " ", " "],
    ];
    games[game._id] = {
        gameId: game._id,
        state: "waiting",
        dashboard: board,
        type: "SINGLE_PLAYER",
        players,
    };
    activeSocket.join(game._id.toString());
    activeSocket.on("make.move", (data) => __awaiter(void 0, void 0, void 0, function* () {
        activeSocket.join(data.gameId.toString());
    }));
}));
router.get("/multiplayer", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const game = new Game({
        started: false,
        players: 1,
        turn: true,
        type: "MULTI_PLAYER",
    });
    const ioEmitter = req.app.get("socketIO");
    const mapKeys = Array.from(ioEmitter.sockets.sockets.keys());
    const activeSocket = getActiveSocket(ioEmitter.sockets.sockets);
    function getActiveSocket(sockets) {
        for (const key of mapKeys) {
            const socket = sockets.get(key);
            if (socket.connected) {
                return socket;
            }
        }
        return null;
    }
    const board = [
        [" ", " ", " "],
        [" ", " ", " "],
        [" ", " ", " "],
    ];
    yield game.save();
    games[game._id] = {
        gameId: game._id,
        players: [activeSocket.id],
        state: "waiting",
        dashboard: board,
        type: "MULTI_PLAYER",
    };
    activeSocket.join(game._id.toString());
    res.send(game);
}));
router.post("/join-game", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let game = yield Game.findOne({ _id: req.body.id });
    if (game.players === 2) {
        res.send("You cant join game");
    }
    game.started = true;
    game.players = 2;
    yield game.save();
    const ioEmitter = req.app.get("socketIO");
    const mapKeys = Array.from(ioEmitter.sockets.sockets.keys());
    const allPlayers = getAllTakenSockets(games);
    const activeSocket = getActiveSocket(ioEmitter.sockets.sockets);
    function getAllTakenSockets(games) {
        const players = [];
        for (const value of Object.values(games)) {
            if (value.players && value.players.length > 0) {
                for (const player of value.players)
                    players.push(player);
            }
        }
        return players;
    }
    function getActiveSocket(sockets) {
        for (const key of mapKeys) {
            const lastElement = mapKeys[mapKeys.length - 1];
            const socket = sockets.get(lastElement);
            if (socket.connected && !allPlayers.includes(socket.id)) {
                return socket;
            }
        }
        return null;
    }
    if (games[game._id] && games[game._id].state === "waiting") {
        games[game._id].players.push(activeSocket.id);
        activeSocket.join(game._id.toString());
        const socket = ioEmitter.sockets.sockets.get(games[game._id].players[0]);
        socket.emit("game.start", {});
        activeSocket.emit("game.start", {});
        activeSocket.in(game._id.toString()).emit("game.start", {
            dashboard: games[game._id].dashboard,
            players: games[game._id].players,
            gameId: games[game._id].gameId,
            type: games[game._id].type,
        });
    }
    else {
        activeSocket.emit("gameNotFound");
    }
    res.send(game);
}));
module.exports = router;
module.exports.games = games;
