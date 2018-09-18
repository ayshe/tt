import express from "express";
import bodyParser from "body-parser";
import maintemplate from "./templates/main";
import resultstemplate from "./templates/results";
import {points} from "./src/rules.js";
import {displaysize} from "./src/constants.js";
import ip from "ip";

const version = Math.random().toString(36).substring(8);
const ipAddress = ip.address();

const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

let players = {
    'Nilotpal': {score: 0, wins: 0, losses: 0},
    'Glen': {score: 0, wins: 0, losses: 0},
    'Arnaud': {score: 0, wins: 0, losses: 0},
    'Luke': {score: 0, wins: 0, losses: 0},
    'Zdenek': {score: 0, wins: 0, losses: 0},
    'Gareth': {score: 0, wins: 0, losses: 0},
    'Jaskaran': {score: 0, wins: 0, losses: 0},
    'Kevin': {score: 0, wins: 0, losses: 0},
    'Peter': {score: 0, wins: 0, losses: 0},
    'Frankie': {score: 0, wins: 0, losses: 0},
    'AdamK': {score: 0, wins: 0, losses: 0},
    'AdamA': {score: 0, wins: 0, losses: 0},
    'AndrewF': {score: 0, wins: 0, losses: 0},
    'AndrewN': {score: 0, wins: 0, losses: 0},
    'Robert': {score: 0, wins: 0, losses: 0}
};

const blacklist = [
    'Frankie',
    'AdamK',
    'AdamA'
];

let matches = -1;

let history = {};
let matchlog = [];

const player = (player) => {
    let person = player;
    Object.keys(blacklist).forEach(function (key) {
        if (player == blacklist[key]) {
            person = '(ANON)';
        }
    });
    return person;
};


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
        if (history[key].values.length > displaysize) {
            history[key].values = history[key].values.slice(history[key].values.length - displaysize);
        }
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
        matchlog.push(player(player1[0]) + " (" + a + ") and " + player(player1[1]) + " (" + b + ") [[" + parseInt(a + b, 10) + "]] played " + player(player2[0]) + " (" + c + ") and " + player(player2[1]) + " (" + d + ") [[" + parseInt(c + d, 10) + "]] and they " + (won ? "won" : "lost") + ", for " + outcome['a'] + " points");
        update(players, player1, player2, won, outcome);
        a = players[player1[0]].score;
        b = players[player1[1]].score;
        c = players[player2[0]].score;
        d = players[player2[1]].score;
        //console.log("New ranks: " + player1[0] + " (" + a + "), " + player1[1] + " (" + b + "), " + player2[0] + " (" + c + "), " + player2[1] + " (" + d + ")");
    } else {
        let a = players[player1].score;
        let b = players[player2].score;
        let outcome = game(a, b, won);
        matchlog.push(player(player1) + " (" + a + ") played " + player(player2) + " (" + b + ") and " + (won ? "won" : "lost") + ", for " + outcome['a'] + " points");
        update(players, player1, player2, won, outcome);
        a = players[player1].score;
        b = players[player2].score;
        //console.log("New ranks: " + player1 + " (" + a + ")," + player2 + " (" + b + ")");

    }
    if (matchlog.length > 15) {
        matchlog = matchlog.slice(matchlog.length - 15);
    }
};

const getHistory = () => {
    let data = [];

    Object.keys(history).forEach(function (key) {
        let send = true;
        Object.keys(blacklist).forEach(function (id) {
            if (key == blacklist[id]) {
                send = false;
            }
        });
        if (send) {
            data.push(history[key]);
        }
    });

    return data;
};

const getPlayers = () => {
    let data = [];
    Object.keys(players).forEach(function (key) {
        let unscored = false;
        Object.keys(blacklist).forEach(function (id) {
            if (key == blacklist[id]) {
                unscored = true;
            }
        });
        data.push({name: key, score: unscored ? null : players[key].score});
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
match('Jaskaran', 'Zdenek', true);
match(['Frankie', 'Zdenek'], ['Gareth', 'AndrewN'], true);
match(['Frankie', 'Zdenek'], ['Gareth', 'AndrewN'], false);
match(['Frankie', 'Zdenek'], ['Gareth', 'AndrewN'], true);
match(['Frankie', 'AndrewN'], ['Gareth', 'Zdenek'], true);
match(['Frankie', 'AndrewN'], ['Gareth', 'Zdenek'], true);
match('Zdenek', 'Glen', false);
match('Arnaud', 'Glen', true);
match('Arnaud', 'Glen', false);
match('Gareth', 'Robert', false);
match('Gareth', 'Robert', true);
match('Gareth', 'Robert', true);
match(['Jaskaran', 'Nilotpal'], ['AdamK', 'AndrewF'], true);
match(['Jaskaran', 'Nilotpal'], ['AdamK', 'AndrewF'], false);
match(['Jaskaran', 'Nilotpal'], ['AdamK', 'AndrewF'], true);
match('Frankie', 'Robert', false);
match('Frankie', 'Robert', false);
match('Frankie', 'Robert', true);
match('Gareth', 'Zdenek', false);
match(['Jaskaran', 'Frankie'], ['Zdenek', 'Gareth'], true);
match(['Jaskaran', 'Frankie'], ['Zdenek', 'Gareth'], false);
match(['Jaskaran', 'Frankie'], ['Zdenek', 'Gareth'], true);

match('Zdenek', 'Robert', true);
match('Zdenek', 'Robert', true);
match('Zdenek', 'Robert', false);
match('Zdenek', 'Robert', true);
match('Zdenek', 'Robert', true);
match('Zdenek', 'Arnaud', false);
match('Kevin', 'Frankie', false);
match('Zdenek', 'Arnaud', false);

match('Frankie', 'Luke', true);
match('Frankie', 'Luke', false);
match('Frankie', 'Luke', true);
match('Gareth', 'Luke', true);
match('Gareth', 'Luke', true);
match(['Gareth', 'Zdenek'], ['Luke', 'Arnaud'], false);
match(['Gareth', 'Arnaud'], ['Luke', 'Zdenek'], true);
match(['Frankie', 'Arnaud'], ['Kevin', 'Zdenek'], true);
match(['Frankie', 'Arnaud'], ['Kevin', 'Zdenek'], false);
match(['Frankie', 'Arnaud'], ['Kevin', 'Zdenek'], false);

match(['Luke', 'Gareth'], ['Jaskaran', 'Robert'], false);
match(['Luke', 'Gareth'], ['Jaskaran', 'Robert'], false);


app.get('/api/ipaddress', function (req, res) {
    res.send({
        ipAddress
    });
});

app.get('/api/version', function (req, res) {
    res.send({
        version
    });
});

app.get('/api/matches', function (req, res) {
    res.send({
        matches
    });
});

app.get('/api/players', function (req, res) {
    res.send(getPlayers());
});

app.post('/api/result', function (reg, res) {
    const result = reg.body.data;
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

app.get('/api/matchlog', function (req, res) {
    res.send({matches, matchlog});
});

app.get('/', function (req, res) {
    res.send(maintemplate)
});

app.get('/results', function (req, res) {
    res.send(resultstemplate)
});

app.listen(3020, function () {
    console.log('TT listening on port 3020')
});