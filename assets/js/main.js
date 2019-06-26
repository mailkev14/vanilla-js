(function (require) {
    'use strict';

    require(['step1', 'step2', 'step3', 'step4'], function (step1, step2, step3, step4) {
        console.log(step1, step2, step3, step4);
    });
}(window.require));