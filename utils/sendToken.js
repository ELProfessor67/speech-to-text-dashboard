export const sendToken = (res, user, message, statusCode = 200) => {
  const token = user.getJWTToken();

  let options;
  if (process.env.STATUS_MODE == "dev") {
    options = {
      expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
      httpOnly: true, // Protects against XSS attacks
      secure: false
    };
  } else {
    options = {
      expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
      httpOnly: true, // Prevent client-side access
      secure: true, // Required for HTTPS
      sameSite: "Lax", // Adjust as needed ("Strict", "None", or "Lax")
    };
  }

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    message,
    user,
  });
};
