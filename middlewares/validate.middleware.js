const AppError = require('../utils/app-error');

const DATETIME_PATTERN = /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}(:\d{2})?$/;
const ID_PATTERN = /^[1-9]\d*$/;

const typeCheckers = {
    string: (value) => typeof value === 'string' && value.trim().length > 0,
    integer: (value) => Number.isInteger(value),
    number: (value) => typeof value === 'number' && Number.isFinite(value),
    boolean: (value) => typeof value === 'boolean',
    datetime: (value) => typeof value === 'string' && DATETIME_PATTERN.test(value),
    numeric: (value) => typeof value === 'string' && value.trim() !== '' && Number.isFinite(Number(value)),
    array: (value) => Array.isArray(value),
    object: (value) => typeof value === 'object' && value !== null && !Array.isArray(value)
};

const lengthErrors = (value, rule, path) => {
    const errors = [];
    if (rule.min !== undefined && value.length < rule.min) {
        errors.push(`${path} debe tener una longitud mínima de ${rule.min}`);
    }
    if (rule.max !== undefined && value.length > rule.max) {
        errors.push(`${path} debe tener una longitud máxima de ${rule.max}`);
    }
    return errors;
};

const rangeErrors = (value, rule, path) => {
    const errors = [];
    if (rule.min !== undefined && value < rule.min) {
        errors.push(`${path} debe ser mayor o igual a ${rule.min}`);
    }
    if (rule.max !== undefined && value > rule.max) {
        errors.push(`${path} debe ser menor o igual a ${rule.max}`);
    }
    return errors;
};

const sizeCheckers = {
    string: lengthErrors,
    array: lengthErrors,
    integer: rangeErrors,
    number: rangeErrors,
    numeric: (value, rule, path) => rangeErrors(Number(value), rule, path)
};

const formatErrors = (value, rule, path) => {
    const errors = [];
    if (rule.pattern && !rule.pattern.test(value)) {
        errors.push(`${path} no tiene un formato válido`);
    }
    if (rule.oneOf && !rule.oneOf.includes(value)) {
        errors.push(`${path} debe ser uno de: ${rule.oneOf.join(', ')}`);
    }
    return errors;
};

const validateValue = (value, rule, path) => {
    if (!typeCheckers[rule.type](value)) {
        return [`${path} debe ser de tipo ${rule.type}`];
    }
    const sizeChecker = sizeCheckers[rule.type];
    const errors = [
        ...(sizeChecker ? sizeChecker(value, rule, path) : []),
        ...formatErrors(value, rule, path)
    ];
    if (rule.type === 'array' && rule.items) {
        value.forEach((item, index) => {
            errors.push(...validateValue(item, rule.items, `${path}[${index}]`));
        });
    }
    if (rule.type === 'object' && rule.fields) {
        errors.push(...validateObject(value, rule.fields, `${path}.`, false));
    }
    return errors;
};

const validateObject = (source, rules, prefix, partial) => Object.entries(rules).flatMap(([field, rule]) => {
    const value = source[field];
    if (value === undefined || value === null) {
        return rule.required && !partial ? [`${prefix}${field} es obligatorio`] : [];
    }
    return validateValue(value, rule, `${prefix}${field}`);
});

const buildValidator = (sourceName, partial, requireAnyField) => (rules) => (req, res, next) => {
    const source = req[sourceName] || {};
    const errors = validateObject(source, rules, '', partial);
    const hasAnyField = Object.keys(rules).some((field) => source[field] !== undefined);
    if (requireAnyField && !hasAnyField) {
        errors.push('Debe enviar al menos un campo para actualizar');
    }
    if (errors.length > 0) {
        throw new AppError(400, 'Datos inválidos', errors);
    }
    next();
};

const validateBody = buildValidator('body', false, false);
const validateBodyPartial = buildValidator('body', true, true);
const validateQuery = buildValidator('query', true, false);

const validateId = (req, res, next) => {
    if (!ID_PATTERN.test(req.params.id)) {
        throw new AppError(400, 'El identificador debe ser un entero positivo');
    }
    next();
};

module.exports = { validateBody, validateBodyPartial, validateQuery, validateId };
