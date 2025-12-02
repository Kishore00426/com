import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { hashPassword, comparePassword, generateToken } from "../utils/auth.js";

// -------------------------------------------
// REGISTER
// -------------------------------------------
export const register = async (req, res) => {
  try {
    const { name, email, password, phone, address, city, zipCode } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: "All required fields must be provided" });

    // check if user exists
    const [existing] = await db.select().from(users).where(eq(users.email, email));
    if (existing)
      return res.status(409).json({ success: false, message: "Email already in use" });

    const hashed = await hashPassword(password);

    const [createdUser] = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashed,
        phone,
        address,
        city,
        zip_code: zipCode,  // ✅ FIXED (previously zip_code was undefined)
        role: "user",
      })
      .returning();

    const token = generateToken({
      id: createdUser.id,
      email: createdUser.email,
      role: createdUser.role
    });

    delete createdUser.password;

    return res.status(201).json({
      success: true,
      data: { user: createdUser, token }
    });

  } catch (err) {
    console.log("Register Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// -------------------------------------------
// LOGIN
// -------------------------------------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email and password required" });

    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (!user)
      return res.status(401).json({ success: false, message: "Invalid credentials" });

    const match = await comparePassword(password, user.password);
    if (!match)
      return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    delete user.password;

    res.json({ success: true, data: { user, token } });
  } catch (err) {
    console.log("Login Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// -------------------------------------------
// PROFILE
// -------------------------------------------
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // user ID from JWT token

    // Fetch full user details from database
    const [user] = await db.select().from(users).where(eq(users.id, userId));

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Remove password before sending
    delete user.password;

    res.json({ success: true, data: { user } });
  } catch (err) {
    console.log("Get Profile Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const updateProfile = async (req, res) => {
  try {
    const user = req.user; // set by requireAuth middleware
    const { name, email, phone, address, city, zipCode } = req.body;

    const [updatedUser] = await db
      .update(users)
      .set({
        name,
        email,
        phone,
        address,
        city,
        zip_code: zipCode
      })
      .where(eq(users.id, user.id))
      .returning();

    res.json({ success: true, data: updatedUser });
  } catch (err) {
    console.log("Update Profile Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

