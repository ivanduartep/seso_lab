"use strict";

// Print all entries, across all of the *async* sources, in chronological order.

const fetchEntry = async (logSource) => {
    const entry = await logSource.popAsync();
    return entry || false;
};

const fetchEntries = async (logSource) => {
    const entry = await fetchEntry(logSource);
    if (entry) {
        const entries = await fetchEntries(logSource);
        return [entry, ...entries];
    } else {
        return [];
    }
};

module.exports = async (logSources, printer) => {
    try {
        const entries = await Promise.all(logSources.map((logSource) => fetchEntries(logSource)));
        const sortedEntries = entries.flat().sort((a, b) => a.date - b.date);
        sortedEntries.forEach((entry) => {
            if (entry) {
                printer.print(entry);
            }
        });
        printer.done();
        console.log("Async await sort complete.");
    } catch (error) {
        console.error(error);
    }
};
