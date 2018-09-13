import graph from "./graph";
import players from "./players";
import matchlog from "./matchlog";
const ipAddressHtml = jQuery('.ipaddress');
const matchlogHtml = jQuery('.matchlog');

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
const ipAddress = () => {
    jQuery.ajax({
        url: '/api/ipaddress',
        cache: false
    }).done((result) => {
        ipAddressHtml.html(result.ipAddress);
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
    matchlog();
    ipAddress();
    setInterval(ipAddress, 3600000);
});
