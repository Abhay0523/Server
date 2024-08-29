const UserModel = require('../Models/userModel')
const { checkAlphabet, checkNumber, checkStartingDigit } = require('../Utils/validation');

const createUser = (req, res) => {
    const { name, email, age, mobile, work, add, desc } = req.body;

    if (!name || !email || !age || !mobile || !work || !add) {
        return res.status(422).json({ error: 'Please fill all required fields' });
    }

    if (!checkAlphabet.test(name)) {
        return res.status(422).json({ error: 'Name should contain alphabets only' });
    }

    if (!checkNumber.test(mobile)) {
        return res.status(422).json({ error: 'Mobile number should contain exactly 10 digits' });
    }

    if (!checkStartingDigit.test(mobile)) {
        return res.status(422).json({ error: 'Mobile number should start from 6 to 9' });
    }

    UserModel.checkUserEmail(email, null, (error) => {
        if (error) {
            return res.status(422).json(error);
        }

        UserModel.checkUserMobile(mobile, null, (error) => {
            if (error) {
                return res.status(422).json(error);
            }

            UserModel.insertUser({ name, email, age, mobile, work, add, desc }, (err, result) => {
                if (err) {
                    return res.status(500).json({ error: 'Database insertion error' });
                }
                res.status(201).json(result);
            });
        });
    });
};

const getUsers = (req, res) => {
    const { search } = req.query;

    UserModel.getUsers(search, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching users' });
        }
        res.status(200).json(result);
    });
};

const deactivateUser = (req, res) => {
    const { id } = req.params;

    UserModel.deactivateUser(id, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Error deactivating user' });
        }
        res.status(200).json({ message: 'User deactivated successfully' });
    });
};

const getUserById = (req, res) => {
    const { id } = req.params;

    UserModel.getUserById(id, (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching user' });
        }
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    });
};

const updateUser = (req, res) => {
    const { id } = req.params;
    const { name, email, age, mobile, work, add, desc } = req.body;

    if (!name || !email || !age || !mobile || !work || !add) {
        return res.status(422).json({ error: 'Please fill all required fields' });
    }

    if (!checkAlphabet.test(name)) {
        return res.status(422).json({ error: 'Name should contain alphabets only' });
    }

    if (!checkNumber.test(mobile)) {
        return res.status(422).json({ error: 'Mobile number should contain exactly 10 digits' });
    }

    if (!checkStartingDigit.test(mobile)) {
        return res.status(422).json({ error: 'Mobile number should start from 6 to 9' });
    }

    UserModel.checkUserEmail(email, id, (error) => {
        if (error) {
            return res.status(422).json(error);
        }

        UserModel.checkUserMobile(mobile, id, (error) => {
            if (error) {
                return res.status(422).json(error);
            }

            UserModel.updateUser(id, { name, email, age, mobile, work, add, desc }, (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Error updating user' });
                }
                res.status(200).json({ message: 'User updated successfully' });
            });
        });
    });
};

module.exports = {
    createUser,
    getUsers,
    deactivateUser,
    getUserById,
    updateUser
};
