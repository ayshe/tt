const matchlogHtml = jQuery('.matchlog');
import {displaysize} from "./constants.js";

export default () => {
    jQuery.ajax({
        url: '/api/matchlog',
        cache: false
    }).done((result) => {
        matchlogHtml.html('');
        let count = result.matches - displaysize + 1;
        result.matchlog.forEach(function (match) {
            matchlogHtml.prepend(jQuery(document.createElement('div')).text('Match ' + count + ': ' + match));
            count++;
        });
    });
};
