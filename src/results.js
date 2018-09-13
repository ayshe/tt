import graph from "./graph";
const ipAddressHtml = jQuery('.ipaddress');

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
const matchcount = () => {
    jQuery.ajax({
        url: '/api/matches',
        cache: false
    }).done((result) => {
        if (!window.appMatches) {
            window.appMatches = result.matches;
        } else {
            if (window.appMatches != result.matches) {
                graph();
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

jQuery(function () {
    ping();
    setInterval(ping, 3000);
    matchcount();
    setInterval(matchcount, 3000);
    graph();
    ipAddress();
    setInterval(ipAddress, 3600000);
});
