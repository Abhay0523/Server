const conn = require("../db/connection");

const checkUserEmail = (email, id) => {
    return new Promise((resolve, reject) => {
        let emailQuery = 'SELECT * FROM users WHERE email = ? AND status = 0';
        const emailParams = [email];

        if (id) {
            emailQuery += ' AND id != ?';
            emailParams.push(id);
        }

        conn.query(emailQuery, emailParams, (err, emailResults) => {
            if (err) {
                return reject({ error: 'Database query error' });
            }

            if (emailResults.length > 0) {
                return reject({ error: 'Email already exists' });
            }

            resolve(true);
        });
    });
};

const checkUserMobile = (mobile, id) => {
    return new Promise((resolve, reject) => {
        let mobileQuery = 'SELECT * FROM users WHERE mobile = ? AND status = 0';
        const mobileParams = [mobile];

        if (id) {
            mobileQuery += ' AND id != ?';
            mobileParams.push(id);
        }

        conn.query(mobileQuery, mobileParams, (err, mobileResults) => {
            if (err) {
                return reject({ error: 'Database query error' });
            }

            if (mobileResults.length > 0) {
                return reject({ error: 'Mobile number already exists' });
            }

            resolve(true);
        });
    });
};

const createUser = (userData) => {
    return new Promise((resolve, reject) => {
        const { name, email, age, mobile, work, add } = userData;

        conn.query('INSERT INTO users (name, email, age, mobile, work, `add`) VALUES (?, ?, ?, ?, ?, ?)',
            [name, email, age, mobile, work, add], (err, insertResult) => {
                if (err) {
                    return reject({ error: 'Database insertion error' });
                }
                resolve(insertResult);
            });
    });
};

const getUsers = (search) => {
    return new Promise((resolve, reject) => {
        let sql = 'SELECT * FROM users WHERE status = 0';
        const params = [];

        if (search) {
            sql += ' AND (name LIKE ? OR email LIKE ?)';
            const searchParam = `%${search}%`;
            params.push(searchParam, searchParam);
        }

        conn.query(sql, params, (err, result) => {
            if (err) {
                return reject({ error: 'Error fetching users' });
            }
            resolve(result);
        });
    });
};

const deactivateUsers = (id) => {
    return new Promise((resolve, reject) => {
        conn.query('UPDATE users SET status = 1 WHERE id = ?', [id], (err) => {
            if (err) {
                return reject({ error: 'Error deactivating user' });
            }
            resolve({ message: 'User deactivated successfully' });
        });
    });
};

const getUserByIds = (id) => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT * FROM users WHERE id = ?', [id], (err, rows) => {
            if (err) {
                return reject({ error: 'Error fetching user' });
            }

            if (rows.length > 0) {
                resolve(rows[0]);
            } else {
                reject({ error: 'User not found' });
            }
        });
    });
};

const updateUsers = (id, userData) => {
    return new Promise((resolve, reject) => {
        const { name, email, age, mobile, work, add, desc } = userData;

        conn.query('UPDATE users SET name = ?, email = ?, age = ?, mobile = ?, work = ?, `add` = ?, `desc` = ? WHERE id = ?',
            [name, email, age, mobile, work, add, desc, id], (err, finalResult) => {
                if (err) {
                    return reject({ error: 'Error updating user' });
                }
                resolve({ message: 'User updated successfully' });
            });
    });
};

module.exports = {
    checkUserEmail,
    checkUserMobile,
    createUser,
    getUsers,
    deactivateUsers,
    getUserByIds,
    updateUsers
};
