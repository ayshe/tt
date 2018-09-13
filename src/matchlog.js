const matchlogHtml = jQuery('.matchlog');

export default () => {
    jQuery.ajax({
        url: '/api/matchlog',
        cache: false
    }).done((result) => {
        matchlogHtml.html('');
        let count = result.matches - 14;
        result.matchlog.forEach(function (match) {
            matchlogHtml.prepend(jQuery(document.createElement('div')).text('Match ' + count + ': ' + match));
            count++;
        });
    });
};
