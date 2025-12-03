import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

const users = [
  {
    id: 1,
    username: "admin",
    name: "Admin",
    password: "admin-only", // TODO: Hash this with bcrypt
  },
];

export default function configurePassport() {
  // Define the local strategy
  const myStrategy = new LocalStrategy(function verify(username, password, cb) {
    console.log("🔑 Verifying user:", username);

    const foundUser = users.find((u) => u.username === username);

    if (!foundUser) {
      console.log("❌ User not found:", username);
      return cb(null, false, { message: "Incorrect username or password." });
    }

    console.log("🔐 User found:", username);

    if (password !== foundUser.password) {
      console.log("❌ Incorrect password for user:", username);
      return cb(null, false, { message: "Incorrect username or password." });
    }

    // Valid user and correct password
    const { ...userWithoutPassword } = foundUser;
    console.log("✅ Authentication successful for:", username);
    return cb(null, userWithoutPassword);
  });

  console.log("🔐 Configuring passport authentication strategy");
  passport.use(myStrategy);

  // Serialize user into session
  passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
      cb(null, { id: user.id, username: user.username, name: user.name });
    });
  });

  // Deserialize user from session
  passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
      return cb(null, user);
    });
  });

  console.log("✅ Passport configuration complete");
}
