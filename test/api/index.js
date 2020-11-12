const {get, post} = require('../../lib/request');

exports.index = {
    req: () => get('http://localhost'),
    assert: (response) => {
        return /giants/.test(response);
    }
};

exports.emptyKoa = {
    req: () => get('http://localhost:3009'),
    assert: (response) => {
        return /Hello/.test(response);
    }
};


