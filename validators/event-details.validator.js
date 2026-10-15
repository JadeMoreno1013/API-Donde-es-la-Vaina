const AppError = require('../utils/app-error');

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

const isText = (value) => typeof value === 'string' && value.trim().length > 0;
const isTime = (value) => typeof value === 'string' && TIME_PATTERN.test(value);
const isScore = (value) => Number.isInteger(value) && value >= 0;
const isFilledList = (value) => Array.isArray(value) && value.length > 0;

const detailsCheckers = {
    concert: (details) => isFilledList(details.lineup)
        && details.lineup.every((slot) => isText(slot?.artist) && isTime(slot?.time)),
    sports: (details) => isText(details.home_team)
        && isText(details.away_team)
        && isScore(details.score?.home)
        && isScore(details.score?.away),
    theater: (details) => isFilledList(details.cast)
        && details.cast.every((member) => isText(member?.performer) && isText(member?.character))
        && Array.isArray(details.intermissions)
        && details.intermissions.every((intermission) => isTime(intermission?.time))
};

const validateEventDetails = (eventType, details) => {
    if (!detailsCheckers[eventType](details)) {
        throw new AppError(400, `El contenido de event_details no corresponde a un evento de tipo ${eventType}`);
    }
};

module.exports = { validateEventDetails };
