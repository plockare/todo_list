function getTimeStamp() {
	var now = new Date();
	return (
		(now.getMonth() + 1) + '/' + (now.getDate()) + '/' + now.getFullYear() + " "
		+ now.getHours() + ':'
		+ ((now.getMinutes() < 10) ? ("0" + now.getMinutes()) : (now.getMinutes())) + ':'
		+ ((now.getSeconds() < 10) ? ("0" + now.getSeconds()) : (now.getSeconds())) + '.'
		+ (
			(now.getMilliseconds() > 99 ? '' : '0')
			+ (now.getMilliseconds() > 9 ? '' : '0')
			+  now.getMilliseconds()
		)
	);
}

function _log (level){
	return function (){
		var larg = ['['+ getTimeStamp() +']', level+':'];
		c.log.apply(c, larg.concat.apply(larg, arguments))
	}
}

var c = console, log = {};

log.debug = _log('DEBUG');
log.trace = _log('TRACE');
log.info  = _log(' INFO');
log.warn  = _log(' WARN');
log.error = _log('ERROR');
log.fatal = _log('FATAL');

module.exports = log;
