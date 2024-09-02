const { checkAlphabet, checkNumber, checkStartingDigit } = require("../Utils/Validation");
const { checkUserEmail, checkUserMobile, createUser, getUsers, deactivateUsers, getUserByIds, updateUsers } = require("../Models/Model");

const userCreate = async (req, res) => {
    try {
        const { name, email, age, mobile, work, add, desc } = req.body;

        if (!name || !email || !age || !mobile || !work || !add) {
            return res.status(422).json({ error: 'Please fill all fields' });
        }

        if(!checkAlphabet.test(name)){
            return res.status(422).json({error:"Name should contain onlu alphabet"})
        }
        if(!checkNumber.test(age)){
            return res.status(422).json({error:"Age must be a number"})
        }
        if(!checkStartingDigit.test(mobile)){
            return res.status(422).json({error:"Mobile Number Should Starts with 6-9 Only"})
        }

        await checkUserEmail(email);
        await checkUserMobile(mobile);

        const insertResult = await createUser(req.body);

        res.status(201).json({ message: 'User created successfully', data: insertResult });
    } catch (error) {
        res.status(422).json({ error: error.error || 'An error occurred' });
    }
};

const getUser = async (req, res) => {
    try {
        const { search } = req.query;
        const users = await getUsers(search);

        if (users.length === 0) {
            return res.status(404).json({ error: 'No users found' });
        }

        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.error || 'An error occurred' });
    }
};

const deactivateUser = async (req, res) => {
    try {
        const { id } = req.params;
        await deactivateUsers(id);
        res.json({ message: 'User deactivated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.error || 'An error occurred' });
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await getUserByIds(id);

        res.json(user);
    } catch (error) {
        res.status(404).json({ error: error.error || 'User not found' });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, age, mobile, work, add,  } = req.body;

        if (!name || !email || !age || !mobile || !work || !add) {
            return res.status(422).json({ error: 'Please fill all fields' });
        }
        if(!checkAlphabet.test(name)){
            return res.status(422).json({error:"Name should contain onlu alphabet"})
        }
        if(!checkNumber.test(age)){
            return res.status(422).json({error:"Age must be a number"})
        }
        
    

        await checkUserEmail(email, id);
        await checkUserMobile(mobile, id);
        if(!checkStartingDigit.test(mobile)){
            return res.status(422).json({error:"Mobile Number Should Starts with 6-9 Only"})
        }

        await updateUsers(id, req.body);

        res.json({ message: 'User updated successfully', });
    } catch (error) {
        res.status(422).json({ error: error.error || 'An error occurred' });
    }
};

module.exports = {
    userCreate,
    getUser,
    deactivateUser,
    getUserById,
    updateUser
};
