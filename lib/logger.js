 function eventlogger() {
	['error', 'warn', 'info', 'debug', 'trace'].forEach(method => {
		console[method] = () => {};
	});

	const loggingLibraries = ['pino'];
	loggingLibraries.forEach(lib => {
		try {
			const logger = require(lib);
			if (logger && logger.createLogger) {
				logger.createLogger = () => ({
					info: () => {},
					warn: () => {},
					error: () => {},
					debug: () => {},
				});
			}
		} catch {}
	});
}
module.exports = { eventlogger };
