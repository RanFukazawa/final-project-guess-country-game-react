import express from "express";
import passport from "passport";

const router = express.Router();

// Login endpoint - returns JSON instead of redirecting
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    // Handle server errors
    if (err) {
      console.error("❌ Authentication error:", err);
      return res
        .status(500)
        .json({ error: "Server error during authentication" });
    }

    // Handle invalid credentials
    if (!user) {
      console.log("❌ Authentication failed:", info?.message);
      return res.status(401).json({
        error: info?.message || "Invalid username or password",
      });
    }

    // Login successful - create session
    req.login(user, (loginErr) => {
      if (loginErr) {
        console.error("❌ Login error:", loginErr);
        return res.status(500).json({ error: "Failed to create session" });
      }

      console.log("✅ User logged in successfully:", user.username);
      return res.json({
        success: true,
        user: user,
        message: "Login successful",
      });
    });
  })(req, res, next);
});

// Check authentication status
router.get("/user", (req, res) => {
  if (req.isAuthenticated()) {
    console.log("✅ User is authenticated:", req.user.username);
    res.json({
      authenticated: true,
      user: req.user,
    });
  } else {
    console.log("❌ User not authenticated");
    res.json({
      authenticated: false,
      user: null,
    });
  }
});

// Logout endpoint - ADD THIS
router.post("/logout", (req, res) => {
  const username = req.user?.username;

  req.logout((err) => {
    if (err) {
      console.error("❌ Logout error:", err);
      return res.status(500).json({ error: "Failed to logout" });
    }

    console.log("✅ User logged out:", username);
    res.json({
      success: true,
      message: "Logged out successfully",
    });
  });
});

export default router;
