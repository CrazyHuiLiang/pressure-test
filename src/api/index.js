const {get, post} = require('../lib/request');

exports.index = {
    req: () => get('http://localhost'),
    assert: (response) => {
        return /giants/.test(response);
    }
};

