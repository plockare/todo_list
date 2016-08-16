'use strict';

let STATE = ['COMPLETED', 'CREATED'];
let STATE_MAP = {};
STATE.forEach(item => {
	STATE_MAP[item] = item;
});

let STATE_TRANSITION = {};
STATE_TRANSITION[STATE_MAP.COMPLETED] = false;
STATE_TRANSITION[STATE_MAP.CREATED] = true;

module.exports.STATE = STATE;
module.exports.STATE_MAP = STATE_MAP;
module.exports.STATE_TRANSITION = STATE_TRANSITION;
