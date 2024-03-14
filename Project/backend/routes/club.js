const express = require("express");
const z = require("zod");
const router = express.Router();
const { Club, Event, User } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("./middleware");

const createClub = z.object({
    username: z.string().min(3).max(30).trim(),
    password: z.string().min(8).trim(),
    registrationNumber: z.string().length(9),
    email: z.string().email(),
    title: z.string(),
    description: z.string()
});

router.post("/signup", async (req, res)=>{
    const request = req.body;
    const { success } = createClub.safeParse(request);
    if (!success){
        return res.json({message: "Invalid Inputs"});
    } 
    const clubAlreadyExists = await Club.findOne({
        "$or": [
            { title: request.title },
            { email: request.email },
            { registrationNumber: request.registrationNumber }
        ]
    })
    
    if (clubAlreadyExists){
        return res.json({message: "Club already exists."});
    }

    const createdClub = new Club(request);
    hashedPassword = await createdClub.createHash(request.password);
    createdClub.password = hashedPassword;

    const clubCreated = await createdClub.save();
    if (clubCreated){
        const token = jwt.sign({userId: clubCreated._id}, JWT_SECRET);
        return res.json({token, message: "Club created successfully"});
    } else {
        res.json({message: "Error while creating club."});
    }
});

const loginClub = z.object({
    registrationNumber: z.string().length(9),
    password: z.string().min(8).trim()
})

router.get("/signin", async (req, res)=>{
    const request = req.body;
    const { success } = loginClub.safeParse(request);
    if (!success){
        return res.json({message: "Invalid inputs"});
    }
    const { registrationNumber, password } = request;
    const club = await Club.findOne({registrationNumber});
    if (!club){
        return res.json({message: "Club not found"});
    };
    const userId = club._id;
    const validatedPassword = await club.validatePassword(password);
    if (validatedPassword){
        const token = jwt.sign({userId}, JWT_SECRET);
        res.json({token});
    } else {
        res.json({message: "Incorrect Password"});
    }
})

const createEvent = z.object({
    title: z.string(),
    description: z.string(),
    startTime: z.string(),
    endTime: z.string(),
    venue: z.string()
})

router.post("/event", authMiddleware, async (req, res)=>{
    const request = req.body;
    const { success } = createEvent.safeParse(request);
    if (!success){
        return res.json({message: "Invalid inputs."})
    }
    const createdEvent = new Event(request);
    createdEvent.club = req.userId;
    const eventCreated = await createdEvent.save();

    const pushedEvent = await Club.updateOne({_id: req.userId}, {
        "$push": {createdEvents: createdEvent._id}
    })
    
    if (eventCreated && pushedEvent){
        return res.json({eventId: createdEvent._id, event: request});
    } else {
        return res.json({message: "Error while creating the event"});
    }
})

router.get("/events", authMiddleware, async (req, res)=>{
    const club = await Club.findOne({_id: req.userId});
    const events = await Event.find({_id: {"$in": club.createdEvents}});
    res.json({events});
})

router.get("/details", authMiddleware, async (req, res)=>{
    const club = await Club.findOne({_id: req.userId});
    const events = await Event.find({_id: {"$in": club.createdEvents}});
    const members = await User.find({_id: {"$in": club.members}});
    const details = {
        title: club.title,
        description: club.description,
        email: club.email,
        admin: club.username,
        events,
        members
    }
    res.json({details});
})

const updateBody = z.object({
    username: z.string().optional(),
    email: z.string().email().optional(),
    registrationNumber: z.string().length(9).optional(),
    title: z.string().optional(),
    description: z.string()
})

//edit route
router.put("/edit", authMiddleware, async (req, res)=>{
    const request = req.body;
    const { success } = updateBody.safeParse(request);
    if (!success){
        return res.json({message: "Invalid Inputs"});
    }
    const updatedDetails = await Club.updateOne({_id: req.userId}, req.body);
    if (updatedDetails){
        return res.json({message: "Successfully updated the details."});
    } else {
        return res.json({message: "Unable to update user details."});
    }
})

module.exports = router;

