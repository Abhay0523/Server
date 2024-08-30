const express = require('express');
const router = new express.Router();
const { userCreate, getUser, deactivateUser, getUserById, updateUser } = require("../Controllers/Controller");


router.post("/create", userCreate);
router.get("/getusers", getUser);
router.get("/getusers/:id", getUserById);
router.put("/deactivateuser/:id", deactivateUser);
router.patch("/updateuser/:id", updateUser);

module.exports = router;
