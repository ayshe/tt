import graph from "./graph";
import players from "./players";

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

const playertiles = function () {
    jQuery.ajax({
        url: '/api/players',
        cache: false
    }).done((result) => {
        players(result);
    });
};

jQuery(function () {
    ping();
    setInterval(ping, 3000);
    graph();
    playertiles();
});
