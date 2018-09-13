import graph from "./graph";

const ping = () => {
    jQuery.ajax({
        url: '/api/version',
        cache: false
    }).done((result) => {
        if (!window.appVersion) {
            window.appVersion = result.version;
        } else {
            if (window.appVersion != result.version) {
                window.location.reload();
            }
        }
    });
};

jQuery(function () {
    ping();
    setInterval(ping, 3000);
});

let matches = -1;

var players = {
    'Nilotpal': {score: 1000, wins: 0, losses: 0},
    'Glen': {score: 1000, wins: 0, losses: 0},
    'Arnaud': {score: 1000, wins: 0, losses: 0},
    'Luke': {score: 1000, wins: 0, losses: 0},
    'Zdenek': {score: 1000, wins: 0, losses: 0},
    'Gareth': {score: 1000, wins: 0, losses: 0},
    'Jaskaran': {score: 1000, wins: 0, losses: 0},
    'Frankie': {score: 1000, wins: 0, losses: 0},
    'Robert': {score: 1000, wins: 0, losses: 0}
};

let history = {};


const log = (players) => {
    matches++;
    let line = {match: matches};
    Object.keys(players).forEach(function (key) {
        if (!history.hasOwnProperty(key)) {
            history[key] = {id: key, values: []};
        }
        history[key].values.push({match: matches, score: players[key].score, wins: players[key].wins, losses: players[key].losses});
    });
};

const difference = (a, b) => {
    if (Array.isArray(a) && Array.isArray(b)) {
        return (a[0] + a[1] - b[0] - b[1]) / 2;
    } else {
        return a - b;
    }
};

const isGreaterThan = (a, b) => {
    if (Array.isArray(a) && Array.isArray(b)) {
        return (a[0] + a[1]) > (b[0] + b[1]);
    } else {
        return a > b;
    }
};

const winPoints = (diff) => {
    if (diff < 25) return 10;
    if (diff < 50) return 9;
    if (diff < 75) return 8;
    if (diff < 100) return 7;
    if (diff < 125) return 6;
    if (diff < 150) return 5;
    if (diff < 175) return 4;
    if (diff < 200) return 3;
    if (diff < 225) return 2;
    if (diff < 250) return 1;
    return 0;
};

const upsetPoints = (diff) => {
    if (diff < 25) return 10;
    if (diff < 50) return 12;
    if (diff < 75) return 14;
    if (diff < 100) return 16;
    if (diff < 125) return 19;
    if (diff < 150) return 22;
    if (diff < 175) return 26;
    if (diff < 200) return 31;
    if (diff < 225) return 37;
    if (diff < 250) return 44;
    return 52;
};

const game = (a, b, won) => {
    if (isGreaterThan(a, b)) {
        var diff = difference(a, b);
        var win = winPoints(diff);
        var upset = upsetPoints(diff);
    } else {
        var diff = difference(b, a);
        var win = upsetPoints(diff);
        var upset = winPoints(diff);
    }
    return {
        a: won ? +win : -upset,
        b: won ? -win : +upset,
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
            wins: players[player2[0]].wins + (won ?  0 : 1),
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
            wins: players[player1].wins + (won ?  1 : 0),
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
        console.log(player1 + " (" + a + ") played " + player2 + " (" + b.score + ") and " + (won ? "won" : "lost") + ", for " + outcome['a'] + " points");
        update(players, player1, player2, won, outcome);
        a = players[player1].score;
        b = players[player2].score;
        console.log("New ranks: " + player1 + " (" + a + ")," + player2 + " (" + b + ")");

    }
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

// match('Nilotpal', 'Jaskaran', true);
// match('Nilotpal', 'Jaskaran', false);
// match('Nilotpal', 'Robert', true);
// match('Frankie', 'Robert', false);
// match('Frankie', 'Zdenek', false);
// match('Gareth', 'Robert', true);
// match('Arnaud', 'Robert', true);
// match('Nilotpal', 'Robert', true);
// match('Frankie', 'Robert', true);
// match('Nilotpal', 'Frankie', true);
// match('Nilotpal', 'Arnaud', true);
//
// match(['Nilotpal', 'Jaskaran'], ['Gareth', 'Robert'], true);
// match(['Nilotpal', 'Gareth'], ['Frankie', 'Robert'], true);
// match(['Nilotpal', 'Glen'], ['Frankie', 'Robert'], true);
// match(['Zdenek', 'Gareth'], ['Glen', 'Jaskaran'], false);
// match(['Glen', 'Gareth'], ['Robert', 'Jaskaran'], false);

console.log(history);

let data = [];

Object.keys(history).forEach(function (key) {
    data.push(history[key]);
});

graph(data);