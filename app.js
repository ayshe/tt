import express from "express";
import bodyParser from "body-parser";
import template from "./templates/main";
import {points} from "./src/rules.js";

const version = Math.random().toString(36).substring(8);

const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

let players = {
    'Nilotpal': {score: 1000, wins: 0, losses: 0},
    'Glen': {score: 1000, wins: 0, losses: 0},
    'Arnaud': {score: 1000, wins: 0, losses: 0},
    'Luke': {score: 1000, wins: 0, losses: 0},
    'Zdenek': {score: 1000, wins: 0, losses: 0},
    'Gareth': {score: 1000, wins: 0, losses: 0},
    'Jaskaran': {score: 1000, wins: 0, losses: 0},
    'Frankie': {score: 1000, wins: 0, losses: 0},
    'AdamK': {score: 1000, wins: 0, losses: 0},
    'AdamA': {score: 1000, wins: 0, losses: 0},
    'Andrew': {score: 1000, wins: 0, losses: 0},
    'Robert': {score: 1000, wins: 0, losses: 0}
};

let matches = -1;

let history = {};


const log = (players) => {
    matches++;
    let line = {match: matches};
    Object.keys(players).forEach(function (key) {
        if (!history.hasOwnProperty(key)) {
            history[key] = {id: key, values: []};
        }
        history[key].values.push({
            match: matches,
            score: players[key].score,
            wins: players[key].wins,
            losses: players[key].losses
        });
    });
};

const game = (a, b, won) => {
    const winlose = points(a, b);
    return {
        a: won ? +winlose.win : -winlose.upset,
        b: won ? -winlose.win : +winlose.upset,
    }
};

const update = (players, player1, player2, won, outcome) => {
    if (Array.isArray(player1) && Array.isArray(player2)) {
        players[player1[0]] = {
            score: players[player1[0]].score + outcome['a'],
            wins: players[player1[0]].wins + (won ? 1 : 0),
            losses: players[player1[0]].losses + (won ? 0 : 1)
        };
        players[player1[1]] = {
            score: players[player1[1]].score + outcome['a'],
            wins: players[player1[1]].wins + (won ? 1 : 0),
            losses: players[player1[1]].losses + (won ? 0 : 1)
        };

        players[player2[0]] = {
            score: players[player2[0]].score + outcome['b'],
            wins: players[player2[0]].wins + (won ? 0 : 1),
            losses: players[player2[0]].losses + (won ? 1 : 0)
        };
        players[player2[1]] = {
            score: players[player2[1]].score + outcome['b'],
            wins: players[player2[1]].wins + (won ? 0 : 1),
            losses: players[player2[1]].losses + (won ? 1 : 0)
        };
    } else {
        players[player1] = {
            score: players[player1].score + outcome['a'],
            wins: players[player1].wins + (won ? 1 : 0),
            losses: players[player1].losses + (won ? 0 : 1)
        };
        players[player2] = {
            score: players[player2].score + outcome['b'],
            wins: players[player2].wins + (won ? 0 : 1),
            losses: players[player2].losses + (won ? 1 : 0)
        };
    }
    log(players);
};

const match = (player1, player2, won) => {
    if (Array.isArray(player1) && Array.isArray(player2)) {
        let a = players[player1[0]].score;
        let b = players[player1[1]].score;
        let c = players[player2[0]].score;
        let d = players[player2[1]].score;
        let outcome = game([a, b], [c, d], won);
        console.log(player1[0] + " (" + a + ") and " + player1[1] + " (" + b + ") [[" + parseInt(a + b, 10) + "]] played " + player2[0] + " (" + c + ") and " + player2[1] + " (" + d + ") [[" + parseInt(c + d, 10) + "]] and they " + (won ? "won" : "lost") + ", for " + outcome['a'] + " points");
        update(players, player1, player2, won, outcome);
        a = players[player1[0]].score;
        b = players[player1[1]].score;
        c = players[player2[0]].score;
        d = players[player2[1]].score;
        console.log("New ranks: " + player1[0] + " (" + a + "), " + player1[1] + " (" + b + "), " + player2[0] + " (" + c + "), " + player2[1] + " (" + d + ")");
    } else {
        let a = players[player1].score;
        let b = players[player2].score;
        let outcome = game(a, b, won);
        console.log(player1 + " (" + a + ") played " + player2 + " (" + b + ") and " + (won ? "won" : "lost") + ", for " + outcome['a'] + " points");
        update(players, player1, player2, won, outcome);
        a = players[player1].score;
        b = players[player2].score;
        console.log("New ranks: " + player1 + " (" + a + ")," + player2 + " (" + b + ")");

    }
};

const getHistory = () => {
    let data = [];

    Object.keys(history).forEach(function (key) {
        data.push(history[key]);
    });

    return data;
};

const getPlayers = () => {
    let data = [];
    Object.keys(players).forEach(function (key) {
        data.push({name: key, score: players[key].score});
    });

    return data;
};

log(players);

match('Arnaud', 'Frankie', true);
match('Arnaud', 'Frankie', true);
match('Arnaud', 'Frankie', true);
match(['Zdenek', 'Frankie'], ['Robert', 'Luke'], true);
match('Zdenek', 'Frankie', true);
match('Zdenek', 'Frankie', true);
match('Zdenek', 'Frankie', true);
match(['Luke', 'Frankie'], ['Robert', 'Gareth'], false);
match(['Luke', 'Frankie'], ['Robert', 'Gareth'], true);
match(['Luke', 'Frankie'], ['Robert', 'Gareth'], false);
match('Robert', 'Frankie', false);
match(['AdamK', 'Robert'], ['Frankie', 'Jaskaran'], true);
match('Robert', 'Frankie', false);
match('Robert', 'Frankie', true);
match(['Jaskaran', 'Robert'], ['Frankie', 'Zdenek'], true);
match(['Jaskaran', 'Robert'], ['Frankie', 'Zdenek'], false);

app.get('/api/version', function (req, res) {
    res.send({
        version
    });
});

app.get('/api/players', function (req, res) {
    res.send(getPlayers());
});

app.post('/api/result', function (reg, res) {
    const result = reg.body.data;
    console.log(result);
    if (result.length == 2) {
        match(result[0], result[1], true);
    }
    if (result.length == 4) {
        match([result[0], result[1]], [result[2], result[3]], true);
    }
    res.send(getPlayers());
});

app.get('/api/data', function (req, res) {
    res.send(getHistory());
});

app.get('/', function (req, res) {
    res.send(template)
});

app.listen(3020, function () {
    console.log('TT listening on port 3020')
});