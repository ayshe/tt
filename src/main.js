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

var players = {
    "nil": 1400,
    "grf": 900,
    "jas": 1300,
    "fxa": 1000,
    "rob": 1100
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

// console.log(game(1000, 1000, true));
// console.log(game(1025, 1000, true));
// console.log(game(1050, 1000, true));
// console.log(game(1075, 1000, true));
// console.log(game(1100, 1000, true));
// console.log(game(1125, 1000, true));
// console.log(game(1150, 1000, true));
// console.log(game(1175, 1000, true));
// console.log(game(1200, 1000, true));
// console.log(game(1225, 1000, true));
// console.log(game(1250, 1000, true));

// console.log(game(1000, 1000, false));
// console.log(game(1025, 1000, false));
// console.log(game(1050, 1000, false));
// console.log(game(1075, 1000, false));
// console.log(game(1100, 1000, false));
// console.log(game(1125, 1000, false));
// console.log(game(1150, 1000, false));
// console.log(game(1175, 1000, false));
// console.log(game(1200, 1000, false));
// console.log(game(1225, 1000, false));
// console.log(game(1250, 1000, false));

// console.log(game([1000, 1000], [1000, 1000], true));
// console.log(game([1250, 1000], [1000, 1000], true));
// console.log(game([1500, 1000], [1000, 1000], true));

// console.log(game([1000, 1000], [1000, 1000], false));
// console.log(game([1250, 1000], [1000, 1000], false));
// console.log(game([1500, 1000], [1000, 1000], false));

const update = (players, player1, player2, outcome) => {
    if (Array.isArray(player1) && Array.isArray(player2)) {
        players[player1[0]] = players[player1[0]] + outcome['a'];
        players[player1[1]] = players[player1[1]] + outcome['a'];
        players[player2[0]] = players[player2[0]] + outcome['b'];
        players[player2[1]] = players[player2[1]] + outcome['b'];
    } else {
        players[player1] = players[player1] + outcome['a'];
        players[player2] = players[player2] + outcome['b'];
    }
};

const match = (player1, player2) => {
    if (Array.isArray(player1) && Array.isArray(player2)) {
        let a = players[player1[0]];
        let b = players[player1[1]];
        let c = players[player2[0]];
        let d = players[player2[1]];
        let won = Math.random() >= 0.5;
        let outcome = game([a, b], [c, d], won);
        console.log(player1[0] + " (" + a + ") and " + player1[1] + " (" + b + ") [[" + parseInt(a + b, 10) + "]] played " + player2[0] + " (" + c + ") and " + player2[1] + " (" + d + ") [[" + parseInt(c + d, 10) + "]] and they " + (won ? "won" : "lost") + ", for " + outcome['a'] + " points");
        update(players, player1, player2, outcome);
        a = players[player1[0]];
        b = players[player1[1]];
        c = players[player2[0]];
        d = players[player2[1]];
        console.log("New ranks: " + player1[0] + " (" + a + "), " + player1[1] + " (" + b + "), " + player2[0] + " (" + c + "), " + player2[1] + " (" + d + ")");
    } else {
        let a = players[player1];
        let b = players[player2];
        let won = Math.random() >= 0.5;
        let outcome = game(a, b, won);
        console.log(player1 + " (" + a + ") played " + player2 + " (" + b + ") and " + (won ? "won" : "lost") + ", for " + outcome['a'] + " points");
        update(players, player1, player2, outcome);
        a = players[player1];
        b = players[player2];
        console.log("New ranks: " + player1 + " (" + a + ")," + player2 + " (" + b + ")");

    }
};

match('nil', 'jas');
match('nil', 'jas');
match('nil', 'rob');
match('fxa', 'rob');
match('grf', 'rob');
match('nil', 'rob');
match('nil', 'rob');
match('nil', 'fxa');

match(['nil', 'jas'], ['grf', 'rob']);
match(['nil', 'grf'], ['fxa', 'rob']);
