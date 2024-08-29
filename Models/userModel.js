const conn = require('../db/connection');

const checkUserEmail = (email, id, callback) => {
    let query = 'SELECT * FROM users WHERE email = ? AND status = 0';
    const params = [email];

    if (id) {
        query += ' AND id != ?';
        params.push(id);
    }

    conn.query(query, params, (err, results) => {
        if (err) return callback({ error: 'Database query error' });
        if (results.length > 0) return callback({ error: 'Email already exists' });
        callback(null, true);
    });
};

const checkUserMobile = (mobile, id, callback) => {
    let query = 'SELECT * FROM users WHERE mobile = ? AND status = 0';
    const params = [mobile];

    if (id) {
        query += ' AND id != ?';
        params.push(id);
    }

    conn.query(query, params, (err, results) => {
        if (err) return callback({ error: 'Database query error' });
        if (results.length > 0) return callback({ error: 'Mobile number already exists' });
        callback(null, true);
    });
};

const insertUser = (user, callback) => {
    const query = 'INSERT INTO users (name, email, age, mobile, work, `add`, `desc`) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const params = [user.name, user.email, user.age, user.mobile, user.work, user.add, user.desc];

    conn.query(query, params, (err, result) => {
        if (err) return callback(err);
        callback(null, result);
    });
};

const getUsers = (search, callback) => {
    let query = 'SELECT * FROM users WHERE status = 0';
    const params = [];

    if (search) {
        query += ' AND (name LIKE ? OR email LIKE ?)';
        const searchParam = `%${search}%`;
        params.push(searchParam, searchParam);
    }

    conn.query(query, params, (err, result) => {
        if (err) return callback(err);
        callback(null, result);
    });
};

const deactivateUser = (userId, callback) => {
    const sql = 'UPDATE users SET status = 1 WHERE id = ?';
    conn.query(sql, [userId], (err, result) => {
        if (err) {
            return callback(err);
        }
        callback(null, result);
    });
};

const getUserById = (id, callback) => {
    const query = 'SELECT * FROM users WHERE id = ?';
    conn.query(query, [id], (err, rows) => {
        if (err) return callback(err);
        if (rows.length > 0) return callback(null, rows[0]);
        callback(null, null);
    });
};

const updateUser = (id, user, callback) => {
    const query = 'UPDATE users SET name = ?, email = ?, age = ?, mobile = ?, work = ?, `add` = ?, `desc` = ? WHERE id = ?';
    const params = [user.name, user.email, user.age, user.mobile, user.work, user.add, user.desc, id];

    conn.query(query, params, (err) => {
        if (err) return callback(err);
        callback(null);
    });
};

module.exports = {
    checkUserEmail,
    checkUserMobile,
    insertUser,
    getUsers,
    deactivateUser,
    getUserById,
    updateUser
};
