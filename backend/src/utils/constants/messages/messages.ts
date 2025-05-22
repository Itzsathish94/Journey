export const MongoDB = {
  SUCCESS: "SUCCESS: MongoDB connected",
  ERROR: "ERROR: MongoDB connection error",
};

export const UserError = {
  USER_ALREADY_EXISTS: "ERROR: User already exists. Please log in instead.",
  USER_NOT_FOUND: "ERROR: No user found with this email.",
  INVALID_CREDENTIALS: "ERROR: Invalid email or password.",
  INCORRECT_OTP: "ERROR: Incorrect OTP.",
  EMAIL_VERIFICATION_FAILED: "ERROR: Email verification failed.",
  TOKEN_INVALID: "ERROR: Invalid or expired token.",
  PASSWORD_RESET_FAILED: "ERROR: Password reset failed.",
  GOOGLE_LOGIN_FAILED: "ERROR: Google login failed.",
  INTERNAL_SERVER_ERROR: "ERROR: Internal server error.",
};

export const UserSuccess = {
  SIGNUP_SUCCESS: "SUCCESS: Signup successful, OTP sent to email.",
  OTP_SENT: "SUCCESS: OTP has been sent to your email successfully!",
  USER_CREATED: "SUCCESS: User created successfully!",
  LOGIN_SUCCESS: "SUCCESS: User logged in successfully!",
  LOGOUT_SUCCESS: "SUCCESS: Logout successful!",
  PASSWORD_RESET: "SUCCESS: Password changed successfully!",
  EMAIL_VERIFIED: "SUCCESS: Email verified successfully!",
  TOKEN_VERIFIED: "SUCCESS: Token verified successfully!",
  GOOGLE_LOGIN_SUCCESS: "SUCCESS: Google login successful!",
  REDIERCTING_OTP_PAGE: "SUCCESS: Rediercting To OTP Page",
  REDIERCTING_PASSWORD_RESET_PAGE: "SUCCESS: Redirecting to Reset Password Page",
};

export const OtpResponses = {
  NO_OTP_DATA: "ERROR: Retry again Failed To Login!",
};

export const AuthError = {
  NO_ACCESS_TOKEN: "ERROR: Unauthorized access. Please provide a valid token.",
  NO_REFRESH_TOKEN: "ERROR: Unauthorized access. Session verification required.",
  INVALID_ACCESS_TOKEN: "ERROR: Unauthorized access. Please authenticate again.",
  INVALID_REFRESH_TOKEN: "ERROR: Session verification failed. Please log in again.",
  ACCESS_TOKEN_EXPIRED: "ERROR: Session expired. Refreshing authentication...",
  REFRESH_TOKEN_EXPIRED: "ERROR: Session expired. Please log in again.",
  AUTHENTICATION_FAILED: "ERROR: Authentication failed. Please try again later.",
  PERMISSION_DENIED: "ERROR: You do not have permission to perform this action.",
  ACCESS_FORBIDDEN: "ERROR: You do not have permission to perform this action.",
  TOKEN_EXPIRED_NAME: "ERROR: TokenExpiredError",
};

export const GeneralServerError = {
  INTERNAL_SERVER_ERROR: "ERROR: Internal server error!",
  DATABASE_ERROR: "ERROR: Database operation failed!",
  OPERATION_FAILED: "ERROR: Operation could not be completed!",
  UNEXPECTED_ERROR: "ERROR: An unexpected error occurred!",
};

export const JwtError = {
  JWT_NOT_FOUND: "ERROR: JWT not found in the cookies",
  INVALID_JWT: "ERROR: Invalid JWT",
  JWT_EXPIRATION: "1h", 
  JWT_REFRESH_EXPIRATION: "6h", 
};

export const EnvError = {
  CONST_ENV: "",
  JWT_SECRET_NOT_FOUND: "ERROR: JWT secret not found in the env",
  NOT_FOUND: "ERROR: Env not found",
  ADMIN_NOT_FOUND: "ERROR: Environment variables for admin credentials not found",
};
