const AppError = require('../utils/app-error');
const pick = require('../utils/pick');
const userDao = require('../dao/user.dao');

const REGISTRATION_FIELDS = ['name', 'last_name', 'email', 'password'];
const UPDATE_FIELDS = [...REGISTRATION_FIELDS, 'is_admin'];

const assertEmailAvailable = async (email, ownerId) => {
    const existing = await userDao.findByEmail(email);
    if (existing && existing.id_user !== ownerId) {
        throw new AppError(409, 'El correo ya está registrado');
    }
};

const list = () => userDao.findAll();

const getById = async (id) => {
    const user = await userDao.findById(id);
    if (!user) {
        throw new AppError(404, 'Usuario no encontrado');
    }
    return user;
};

const create = async (body) => {
    await assertEmailAvailable(body.email);
    const id = await userDao.insert({ ...pick(body, REGISTRATION_FIELDS), is_admin: false });
    return userDao.findById(id);
};

const update = async (id, body, auth) => {
    await getById(id);
    if (body.is_admin !== undefined && !auth.is_admin) {
        throw new AppError(403, 'Solo un administrador puede cambiar el rol');
    }
    if (body.email) {
        await assertEmailAvailable(body.email, id);
    }
    await userDao.update(id, pick(body, UPDATE_FIELDS));
    return userDao.findById(id);
};

const remove = async (id) => {
    await getById(id);
    await userDao.remove(id);
};

module.exports = { list, getById, create, update, remove };
