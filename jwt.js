
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { findByUsername } from "../utils/db.js";

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

router.post("/login", async (req, res) => {
  const { username, password } = req.body ?? {};

  // Check required fields
  if (!username || !password) {
    return res.status(400).json({
      error: "Username and password are required."
    });
  }

  try {
    const user = findByUsername(username);

    // Username does not exist
    if (!user) {
      return res.status(401).json({
        error: "Invalid username or password."
      });
    }

    let passwordMatches = false;

    // Verify the bcrypt hash stored in users.json
    if (user.passwordHash) {
      passwordMatches = await bcrypt.compare(
        password,
        user.passwordHash
      );
    } else if (typeof user._password === "string") {
      // Fallback if a user has no password hash
      passwordMatches = password === user._password;
    }

    // Incorrect password
    if (!passwordMatches) {
      return res.status(401).json({
        error: "Invalid username or password."
      });
    }

    // Create authentication token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({ token });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      error: "Internal server error."
    });
  }
});

export default router;
