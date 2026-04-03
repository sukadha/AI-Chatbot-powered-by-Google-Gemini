import express from "express";
import { 
    signup, 
    login, 
    getAllUsers, 
    getUserById,
    getLoginStats,
    deleteUser
} from "../controllers/userController.js";

const router = express.Router();

// Auth routes
router.post("/signup", signup);
router.post("/login", login);

// User management routes
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.get("/stats/logins", getLoginStats);
router.delete("/users/:id", deleteUser);

export default router;