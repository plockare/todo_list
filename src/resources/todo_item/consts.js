const STATE = ['COMPLETED', 'CREATED'];
const STATE_MAP = {};
STATE.forEach(item => {
  STATE_MAP[item] = item;
});

const STATE_TRANSITION = {};
STATE_TRANSITION[STATE_MAP.COMPLETED] = false;
STATE_TRANSITION[STATE_MAP.CREATED] = true;


export default {
  STATE,
  STATE_MAP,
  STATE_TRANSITION
};
