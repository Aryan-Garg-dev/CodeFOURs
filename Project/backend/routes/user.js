const express = require("express");
const z = require("zod");
const router = express.Router();
const { User, Event, Club } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("./middleware");

const createUser = z.object({
    username: z.string().min(3).max(30).trim(),
    password: z.string().min(8).trim(),
    registrationNumber: z.string().length(9),
    email: z.string().email(),
})

router.post("/signup", async (req, res)=>{
    const request = req.body;
    const { success } = createUser.safeParse(request);
    if (!success){
        return res.json({message: "Invalid Inputs"});
    }
    const userAlreadyExists = await User.findOne({registrationNumber: request.registrationNumber});
    if (userAlreadyExists){
        return res.json({message: "User already exists"});
    }

    const createdUser = new User({
        username: request.username,
        registrationNumber: request.registrationNumber,
        email: request.email,
    })

    hashedPassword = await createdUser.createHash(request.password);
    createdUser.password = hashedPassword;

    const userCreated = await createdUser.save();

    if (userCreated){
        const token = jwt.sign({userId: userCreated._id}, JWT_SECRET);
        res.json({token, message: 'User successfully created'});
    } else {
        res.json({message: "Error while creating user."});
    }
});

const loginUser = z.object({
    registrationNumber: z.string().length(9),
    password: z.string().min(8).trim()
})

router.get("/signin", async (req, res)=>{
    const request = req.body;
    const { success } = loginUser.safeParse(request);
    if (!success){
        return res.json({message: "Invalid Inputs"});
    }
    const { registrationNumber, password } = request;
    const user = await User.findOne({registrationNumber});
    if (!user){
        return res.json("User not found");
    }
    const userId = user._id;
    const validatedPassword = await user.validatePassword(password);
    if (validatedPassword){
        const token = jwt.sign({userId}, JWT_SECRET);
        res.json({token});
    } else {
        res.json({message: "Incorrect Password"});
    }
})

// register for club
router.post("/club", authMiddleware, async (req, res)=>{
    const clubId = req.body.clubId;
    const pushedClub = await User.updateOne({_id: req.userId}, {
        "$push": {registeredClubs: clubId}
    });
    const pushedMember = await User.updateOne({_id: clubId}, {
        "$push": {members: req.userId}
    })
    if (pushedClub && pushedMember){
        return res.json({message: "Successfully registered for club", registration: true})
    } else {
        return res.json({registration: false});
    }
})

// register for event
router.post("/event", async (req, res)=>{
    const eventId = req.body.eventId;
    const pushedEvent = await User.updateOne({id: req.userId}, {
        "$push": {registeredEvents: eventId}
    })
    if (pushedEvent){
        return res.json({message: "Successfully registered for event", registration: true})
    } else {
        return res.json({message: "Unable to register for the event", registration: true})
    }
})

// user details
router.get("/detail", authMiddleware, async (req, res)=>{
    const user = await User.findOne({_id: req.userId});
    const events = await Event.find({_id: {"$in": user.registeredEvents}});
    const clubs = await Club.find({_id: {"$in": user.registeredClubs}});
    const details = {
        username: user.username,
        email: user.password,
        registrationNumber: user.registrationNumber,
        events,
        clubs
    }
    res.json({details});
})

const updateBody = z.object({
    username: z.string().optional(),
    email: z.string().email().optional(),
    registrationNumber: z.string().length(9).optional()
})

//edit route
router.put("/edit", authMiddleware, async (req, res)=>{
    const request = req.body;
    const { success } = updateBody.safeParse(request);
    if (!success){
        return res.json({message: "Invalid Inputs"});
    }
    const updatedDetails = await User.updateOne({_id: req.userId}, req.body);
    if (updatedDetails){
        return res.json({message: "Successfully updated the details."});
    } else {
        return res.json({message: "Unable to update user details."});
    }
})

module.exports = router;