const conn = require("../db/connection");
const { checkAlphabet, checkNumber, checkStartingDigit } = require("../Utils/Validation");


const checkUserEmail = (email, id, callback) => {
    let emailQuery = 'SELECT * FROM users WHERE email = ? and status = 0';
    const emailParams = [email];

    if (id) {
        emailQuery += ' AND id != ?';
        emailParams.push(id);
    }

    conn.query(emailQuery, emailParams, (err, emailResults) => {
        if (err) {
            console.error('Database query error:', err);
            return callback({
                error: 'Database query error'
            }, null);
        }

        if (emailResults.length > 0) {
            return callback({
                error: 'Email already exists'
            }, null);
        }

        callback(null, true);
    });
};


const checkUserMobile = (mobile, id, callback) => {
    let mobileQuery = 'SELECT * FROM users WHERE mobile = ? and status = 0';
    const mobileParams = [mobile];

    if (id) {
        mobileQuery += ' AND id != ?';
        mobileParams.push(id);
    }

    conn.query(mobileQuery, mobileParams, (err, mobileResults) => {
        if (err) {
            console.error('Database query error:', err);
            return callback({
                error: 'Database query error'
            }, null);
        }

        if (mobileResults.length > 0) {
            return callback({
                error: 'Mobile number already exists'
            }, null);
        }

        callback(null, true);
    });
};


const userCreate = (req, res) => {
    const { name, email, age, mobile, work, add, desc } = req.body;

    if (!name || !email || !age || !mobile || !work || !add) {
        return res.status(422).json({
            error: 'Please fill all required fields'
        });
    }

    if (!checkAlphabet.test(name)) {
        return res.status(422).json({
            error: 'Name should contain alphabets only'
        });
    }

    if (!checkNumber.test(mobile)) {
        return res.status(422).json({
            error: 'Mobile number should contain exactly 10 digits'
        });
    }

    if (!checkStartingDigit.test(mobile)) {
        return res.status(422).json({
            error: "Mobile number should Start From 6 to 9"
        });
    }

    checkUserEmail(email, null, (error, result) => {
        if (error) {
            return res.status(422).json(error);
        }

        checkUserMobile(mobile, null, (error, result) => {
            if (error) {
                return res.status(422).json(error);
            }

            conn.query('INSERT INTO users (name, email, age, mobile, work, `add`, `desc`) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [name, email, age, mobile, work, add, desc], (err, insertResult) => {
                    if (err) {
                        console.error('Database insertion error:', err);
                        return res.status(500).json({
                            error: 'Database insertion error'
                        });
                    }
                    res.status(201).json(req.body);
                });
        });
    });
}


const getUser = (req, res) => {
    const { search } = req.query;

    let sql = 'SELECT * FROM users WHERE status = 0';
    const params = [];

    if (search) {
        sql += ' AND (name LIKE ? OR email LIKE ?)';
        const searchParam = `%${search}%`;
        params.push(searchParam, searchParam);
    }

    conn.query(sql, params, (err, result) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).json({
                error: 'Error fetching users'
            });
        }
        res.status(200).json(result);
    });
}


const deactivateUser = (req, res) => {
    const { id } = req.params;

    conn.query('UPDATE users SET status = 1 WHERE id = ?', [id], (err) => {
        if (err) {
            console.error('Error deactivating user:', err);
            return res.status(500).json({
                error: 'Error deactivating user'
            });
        }
        res.status(200).json({
            message: 'User deactivated successfully'
        });
    });
}


const getUserById = (req, res) => {
    const { id } = req.params;

    conn.query('SELECT * FROM users WHERE id = ?', [id], (err, rows) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).json({
                error: 'Error fetching user'
            });
        }

        if (rows.length > 0) {
            res.status(200).json(rows[0]);
        } else {
            res.status(404).json({
                error: 'User not found'
            });
        }
    });
}


const updateUser = (req, res) => {
    const { id } = req.params;
    const { name, email, age, mobile, work, add, desc } = req.body;

    if (!name || !email || !age || !mobile || !work || !add) {
        return res.status(422).json({
            error: 'Please fill all required fields'
        });
    }

    if (!checkAlphabet.test(name)) {
        return res.status(422).json({
            error: 'Name should contain alphabets only'
        });
    }

    if (!checkNumber.test(mobile)) {
        return res.status(422).json({
            error: 'Mobile number should contain exactly 10 digits'
        });
    }

    if (!checkStartingDigit.test(mobile)) {
        return res.status(422).json({
            error: "Mobile number should Start From 6 to 9"
        });
    }

    checkUserEmail(email, id, (error, result) => {
        if (error) {
            return res.status(422).json(error);
        }

        checkUserMobile(mobile, id, (error, result) => {
            if (error) {
                return res.status(422).json(error);
            }

            conn.query('UPDATE users SET name = ?, email = ?, age = ?, mobile = ?, work = ?, `add` = ?, `desc` = ? WHERE id = ?',
                [name, email, age, mobile, work, add, desc, id], (err, finalResult) => {
                    if (err) {
                        console.error('Error updating user:', err);
                        return res.status(500).json({
                            error: 'Error updating user'
                        });
                    }
                    res.status(200).json({
                        message: 'User updated successfully'
                    });
                });
        });
    });
}

module.exports = {
    userCreate,
    getUser,
    deactivateUser,
    getUserById,
    updateUser
}
