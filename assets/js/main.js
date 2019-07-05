(function (require) {
    'use strict';

    require(['step1', 'step2', 'step3', 'step4'], function () {
        var steps = [].slice.call(arguments);
        
        document.getElementById('tabs').onsubmit = function (e) {
            e.preventDefault();
            return false;
        };
        
        steps.forEach( (step, i) => {
            if ( step && step.methods && typeof step.methods.init === 'function' ) {
                step.methods.init();
            }
        });
    });
}(window.require));