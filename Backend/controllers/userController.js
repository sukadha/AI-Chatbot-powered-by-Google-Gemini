import { User } from "../models/user.js";
import bcrypt from "bcryptjs";

// ✅ Signup - Create new user
export const signup = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log("Signup attempt for email:", email);

        // Validation
        if (!email || !password) {
            return res.status(400).json({ 
                success: false,
                message: "All fields are required" 
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                success: false,
                message: "Email already exists. Please login instead." 
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = await User.create({ 
            email, 
            password: hashedPassword 
        });

        console.log("User created successfully:", user.email);

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                id: user._id,
                email: user.email,
                createdAt: user.createdAt
            }
        });

    } catch (error) {
        console.log("Signup error:", error.message);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// ✅ Login - Authenticate user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log("Login attempt for email:", email);

        // Validation
        if (!email || !password) {
            return res.status(400).json({ 
                success: false,
                message: "All fields are required" 
            });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: "Invalid email or password" 
            });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false,
                message: "Invalid email or password" 
            });
        }

        // Update last login time
        user.lastLogin = new Date();
        await user.save();

        console.log("User logged in successfully:", user.email);

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                email: user.email,
                createdAt: user.createdAt,
                lastLogin: user.lastLogin
            }
        });

    } catch (error) {
        console.log("Login error:", error.message);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// ✅ Get all users (View all registered users and logins)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        
        console.log(`Fetched ${users.length} users`);
        
        res.status(200).json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
        console.log("Get users error:", error.message);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// ✅ Get single user by ID
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.log("Get user error:", error.message);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// ✅ Get login stats (users who logged in today/recently)
export const getLoginStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Users who logged in today
        const todayLogins = await User.find({
            lastLogin: { $gte: today, $lt: tomorrow }
        }).select('-password');

        // Total users
        const totalUsers = await User.countDocuments();

        // Recent logins (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const recentLogins = await User.find({
            lastLogin: { $gte: sevenDaysAgo }
        }).select('-password').sort({ lastLogin: -1 });

        console.log(`Stats: Total Users: ${totalUsers}, Today Logins: ${todayLogins.length}`);

        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                todayLogins: todayLogins.length,
                recentLoginsCount: recentLogins.length
            },
            todayLogins,
            recentLogins
        });
    } catch (error) {
        console.log("Login stats error:", error.message);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// ✅ Delete user (optional)
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        console.log("User deleted:", user.email);
        
        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        console.log("Delete user error:", error.message);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};