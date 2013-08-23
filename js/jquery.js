define([
    'jquery-base'
], function(
    $
) {
    // remove jquery access from global scope
    return $.noConflict();
});
