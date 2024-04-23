"use strict";

// Print all entries, across all of the *async* sources, in chronological order.

const fetchEntry = (logSource) => {
  return new Promise((resolve, reject) => {
    logSource.popAsync().then((entry) => {
      if (entry) resolve(entry);
      resolve(false);
    });
  });
};

const fetchEntries = (logSource) => {
  return new Promise((resolve, reject) => {
    fetchEntry(logSource).then((entry) => {
      if (entry) {
        fetchEntries(logSource).then((entries) => {
          resolve([entry, ...entries]);
        });
      } else {
        resolve([]);
      }
    });
  });
};

module.exports = (logSources, printer) => {
  return new Promise((resolve, reject) => {
    Promise.all(logSources.map((logSource) => fetchEntries(logSource)))
      .then((entries) => entries.flat())
      .then((entries) => {
        return entries.sort((a, b) => a.date - b.date);
      })
      .then((sortedEntries) => {
        sortedEntries.forEach((entry) => {
          if (entry) {
            printer.print(entry);
          }
        });
      })
      .finally(() => {
        printer.done();
        resolve(console.log("Async sort complete."));
      });
  });
};
