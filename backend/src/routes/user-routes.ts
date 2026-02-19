import { Router, RequestHandler } from "express";
import {
  userController,
  userProfileController,
  userInterviewerListingController,
} from "../config/dependency-injector/user-dependency-injector";
import upload from "../utils/multer";
import authenticateToken from "../middlewares/authenticated-routes";
import { isUser } from "../middlewares/role-auth";
import { restrictBlockedUser } from "../middlewares/block-check";

const router = Router();

router.post("/signUp", userController.userSignUp.bind(userController));
router.post("/resendOtp", userController.resendOtp.bind(userController));
router.post("/createUser", userController.createUser.bind(userController));
router.post("/login", userController.login.bind(userController));
router.post("/logout", userController.logout.bind(userController));
router.post("/verifyEmail", userController.verifyEmail.bind(userController));
router.post("/verifyResetOtp", userController.verifyResetOtp.bind(userController));
router.post("/forgotResendOtp", userController.forgotResendOtp.bind(userController));
router.post("/resetPassword", userController.resetPassword.bind(userController));
router.post("/googleLogin", userController.doGoogleLogin.bind(userController));

/////////////////////user profile controller/////////////////////////////////

router.get(
  "/profile",
  authenticateToken as RequestHandler,       // ✅
  restrictBlockedUser as RequestHandler,     // ✅
  isUser as RequestHandler,                  // ✅
  userProfileController.getProfile.bind(userProfileController)
);

router.put(
  "/profile",
  authenticateToken as RequestHandler,       // ✅
  restrictBlockedUser as RequestHandler,     // ✅
  isUser as RequestHandler,                  // ✅
  upload.single("profilePic"),
  userProfileController.updateProfile.bind(userProfileController)
);

router.put(
  "/profile/password",
  authenticateToken as RequestHandler,       // ✅
  restrictBlockedUser as RequestHandler,     // ✅
  isUser as RequestHandler,                  // ✅
  userProfileController.updatePassword.bind(userProfileController)
);

// user side interviewer listing
router.get(
  "/interviewers",
  userInterviewerListingController.listinterviewers.bind(userInterviewerListingController)
);

router.get(
  "/interviewers/filters",
  userInterviewerListingController.getAvailableFilters.bind(userInterviewerListingController)
);

router.get(
  "/interviewers/:interviewerId",
  userInterviewerListingController.getinterviewerById.bind(userInterviewerListingController)
);

export default router;