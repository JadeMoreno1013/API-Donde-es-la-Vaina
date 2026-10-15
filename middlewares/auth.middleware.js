const AppError = require('../utils/app-error');
const sessionService = require('../services/session.service');

const extractToken = (req) => {
    const [scheme, token] = (req.headers.authorization || '').split(' ');
    return scheme === 'Bearer' ? token : undefined;
};

const authenticate = (req, res, next) => {
    const token = extractToken(req);
    const auth = token && sessionService.find(token);
    if (!auth) {
        throw new AppError(401, 'Sesión no iniciada o expirada');
    }
    req.auth = auth;
    req.token = token;
    next();
};

const requireAdmin = (req, res, next) => {
    if (!req.auth.is_admin) {
        throw new AppError(403, 'Se requiere rol de administrador');
    }
    next();
};

const requireSelfOrAdmin = (req, res, next) => {
    if (!req.auth.is_admin && req.auth.id_user !== Number(req.params.id)) {
        throw new AppError(403, 'No tiene permiso sobre este recurso');
    }
    next();
};

module.exports = { authenticate, requireAdmin, requireSelfOrAdmin };
