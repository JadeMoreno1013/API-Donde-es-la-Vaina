const AppError = require('../utils/app-error');

const mysqlErrors = {
    ER_DUP_ENTRY: { status: 409, message: 'Ya existe un registro con esos datos únicos' },
    ER_ROW_IS_REFERENCED_2: { status: 409, message: 'El recurso tiene registros asociados y no puede eliminarse' },
    ER_NO_REFERENCED_ROW_2: { status: 400, message: 'Se hace referencia a un recurso que no existe' },
    ER_CHECK_CONSTRAINT_VIOLATED: { status: 400, message: 'Los datos incumplen una restricción de la base de datos' }
};

const notFoundHandler = (req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
};

const errorHandler = (error, req, res, next) => {
    if (error instanceof AppError) {
        return res.status(error.status).json({ error: error.message, details: error.details });
    }
    if (error.type === 'entity.parse.failed') {
        return res.status(400).json({ error: 'El cuerpo de la solicitud no es un JSON válido' });
    }
    const mysqlError = mysqlErrors[error.code];
    if (mysqlError) {
        return res.status(mysqlError.status).json({ error: mysqlError.message });
    }
    console.error(error);
    return res.status(500).json({ error: 'Error interno del servidor' });
};

module.exports = { notFoundHandler, errorHandler };
