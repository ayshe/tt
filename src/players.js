import {points} from "./rules.js";
import matchlog from "./matchlog";

const container = jQuery('.players');
const vs = jQuery('.versus');

let players = {};

const result = (data) => {
    jQuery.ajax({
        url: '/api/result',
        method: 'POST',
        data: JSON.stringify({data: data}),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        cache: false
    }).done(function(result)  {
        draw(result);
        matchlog();
        vs.html('');
        jQuery('active-player').attr('class', 'class', 'col l2 s4 card-panel center-align teal lighten-5');
        players = {};
    });
};

const togglePlayer = (player) => {
    if (players.hasOwnProperty(player.name)) {
        delete players[player.name];
    } else {
        players[player.name] = player.score;
    }
    let playerarray = [];
    Object.keys(players).forEach(function (key) {
        if (players.hasOwnProperty(key)) {
            playerarray.push({name: key, score: players[key]});
        }
    });
    vs.html('');
    if (playerarray.length == 2) {
        const winlose = points(playerarray[0].score, playerarray[1].score);
        const onwin = () => {
            result([playerarray[0].name, playerarray[1].name]);
        };
        const onupset = () => {
            result([playerarray[1].name, playerarray[0].name]);
        };
        matchup(playerarray[0].name + " (" + playerarray[0].score + ")", playerarray[1].name + " (" + playerarray[1].score + ")", winlose.win, winlose.upset, onwin, onupset);
    }
    if (playerarray.length == 4) {
        const winlose = points([playerarray[0].score, playerarray[1].score], [playerarray[2].score, playerarray[3].score]);
        const onwin = () => {
            result([playerarray[0].name, playerarray[1].name, playerarray[2].name, playerarray[3].name]);
        };
        const onupset = () => {
            result([playerarray[2].name, playerarray[3].name, playerarray[0].name, playerarray[1].name]);
        };
        matchup(playerarray[0].name + " / " + playerarray[1].name + " (" + (playerarray[0].score + playerarray[1].score) + ")", playerarray[2].name + " / " + playerarray[3].name + " (" + (playerarray[2].score + playerarray[3].score) + ")", winlose.win, winlose.upset, onwin, onupset);
    }
};

const matchup = (player1, player2, win, upset, onwin, onupset) => {
    const players = jQuery(document.createElement('div')).addClass('row');
    players.append(jQuery(document.createElement('div')).attr('class', 'card-panel center-align red lighten-4 col s5').append(jQuery(document.createElement('h4')).text(player1)).on('click', onwin));
    players.append(jQuery(document.createElement('div')).attr('class', 'card-panel center-align col s2').append(jQuery(document.createElement('h4')).text('vs')));
    players.append(jQuery(document.createElement('div')).attr('class', 'card-panel center-align blue lighten-4 col s5').append(jQuery(document.createElement('h4')).text(player2)).on('click', onupset));
    vs.append(players);
    const buttons = jQuery(document.createElement('div')).addClass('row');
    buttons.append(jQuery(document.createElement('div')).attr('class', 'card-panel center-align red lighten-5 col s5').append(jQuery(document.createElement('h5')).text("(" + win + " points for win)")).on('click', onwin));
    buttons.append(jQuery(document.createElement('div')).attr('class', 'card-panel center-align col s2').append(jQuery(document.createElement('h5'))));
    buttons.append(jQuery(document.createElement('div')).attr('class', 'card-panel center-align blue lighten-5 col s5').append(jQuery(document.createElement('h5')).text("(" + upset + " points for win)")).on('click', onupset));
    vs.append(buttons);
};

const draw = (data) => {
    container.html('').addClass('row');
    data.forEach(function (player) {
        var panel = jQuery(document.createElement('div')).attr('class', 'col l2 s4 card-panel center-align teal lighten-5 player').append(jQuery(document.createElement('h6')).text(player.name + " (" + player.score + ")"));
        panel.on('click', function (e) {
            e.preventDefault();
            jQuery(this).toggleClass('lighten-5');
            jQuery(this).toggleClass('active-player');
            togglePlayer(player);
            return false;
        });
        container.append(panel);
    });
};

export default (data) => {
    draw(data);
};