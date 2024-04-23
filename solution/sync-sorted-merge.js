"use strict";

// Print all entries, across all of the sources, in chronological order.

module.exports = (logSources, printer) => {
  
  const logs = [];
  logSources.forEach((logSource) => {
    let logEntry = logSource.pop();
    while (logEntry) {
      logs.push(logEntry);
      logEntry = logSource.pop();
    }
  });
  const sortedLogs = logs.sort((a, b) => a.date - b.date);

  sortedLogs.forEach((log) => {
    printer.print(log);
  });

  printer.done();
}
