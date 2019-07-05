(function (define) {
    'use strict';

    define(['step', 'persist', 'flatpickr.min'], function (Step, persist, flatpickr) {
        var stepNum = 1,
            tabID = 'personal-tab',
            state = {
                summary: '',
                name: '',
                dob: '',
                age: 0,
                gender: '',
                email: '',
                mobile: '',
                address: '',
                state: '',
                city: '',
                pincode: ''
            },
            els = {
                summary: document.getElementById('summary'),
                name: document.getElementById('name'),
                dob: document.getElementById('dob'),
                age: document.getElementById('age'),
                gender: [].slice.call(document.getElementsByName('gender')),
                email: document.getElementById('email'),
                mobile: document.getElementById('mobile'),
                address: document.getElementById('address'),
                state: document.getElementById('state'),
                city: document.getElementById('city'),
                pincode: document.getElementById('pincode')
            },
            methods = {
                init: function () {
                    // get state city json list
                    fetch('state-city.json')
                        .then(function (res) {
                            return res.json();
                        })
                        .then(function (state_city) {
                            var i, stateStr, data = persist.get(),
                                states = '<option value="">- Select State -</option>',
                                getCities = function () {
                                    var cities = '<option value="">- Select City -</option>',
                                        city, i, len;
                                    
                                    if ( state_city[state.state] ) {
                                        for (i = 0, len = state_city[state.state].length; i < len; i += 1 ) {
                                            city = state_city[state.state][i];

                                            cities += '<option value="'+ city +'">'+ city +'</option>';
                                        }
                                    }

                                    return cities;
                                };

                            // init state values
                            for (stateStr in state_city) {
                                states += '<option value="' + stateStr + '">'+ stateStr +'</option>';
                            }

                            // populate state list
                            els.state.innerHTML = states;

                            for (i in els) {
                                // populate DOM with persisted data
                                switch (i) {
                                    case 'gender':
                                        if ( data['step' + stepNum] && data['step' + stepNum].gender ) {
                                            state.gender = data['step' + stepNum].gender;
                                        }

                                        els.gender.forEach( (v) => {
                                            if ( state.gender && state.gender === v.value ) {
                                                v.checked = true;
                                            } else {
                                                v.checked = false;
                                            }
                                        });
                                    break;

                                    default:
                                        if ( data['step' + stepNum] && data['step' + stepNum][i] ) {
                                            state[i] = els[i].value = data['step' + stepNum][i];
                                        }
                                    break;
                                }

                                // set the DOM value for state select dropdown
                                els.state.value = state.state;

                                // populate cities according to selected state
                                els.city.innerHTML = getCities();

                                // if state is prefilled then set DOM value DOM city dropdown
                                if ( state.state ) {
                                    els.city.value = state.city;
                                }

                                // attach event listeners
                                if ( i === 'dob' ) {
                                    flatpickr(els.dob, {
                                        dateFormat: 'd/m/Y',
                                        onChange: function (selectedDates, dateStr, instance) {
                                            var dob = selectedDates[0],
                                                today = new Date(),
                                                age = today.getFullYear() - dob.getFullYear(); // assume that current month is greater than dobMonth

                                            if ( today.getMonth() <= dob.getMonth() ) {
                                                if ( today.getMonth() === dob.getMonth() ) {
                                                    if ( today.getDate() >= dob.getDate() ) {
                                                        //ok
                                                    } else {
                                                        age -= 1;
                                                    }
                                                } else {
                                                    age -= 1;
                                                }
                                            }

                                            // set age in state
                                            state.age = age;
                                            state.dob = dateStr;

                                            // set age in DOM
                                            els.age.value = age;

                                            persist.set(stepNum, state);
                                        }
                                    });
                                } else if ( i === 'gender' ) {
                                    els.gender.forEach( g => {
                                        g.onchange = function (e) {
                                            // update state object
                                            state['gender'] = this.value;

                                            // persist data to persistent storage
                                            persist.set(stepNum, state);
                                        };
                                    });
                                } else {
                                    (function (stateKey) {
                                        els[stateKey].onchange = function (e) {
                                            // update state object
                                            state[stateKey] = this.value;

                                            // persist data to persistent storage
                                            persist.set(stepNum, state);
                                            
                                            if ( stateKey === 'state' ) {
                                                state.city = '';

                                                els.city.innerHTML = getCities();
                                            }
                                        };
                                    }(i));
                                }
                            }

                            i = data = undefined;
                        });
                },
                validate: function () {

                }
            },
            step = new Step(stepNum, tabID, state, els, methods);

        return step;
    });
}(window.define));