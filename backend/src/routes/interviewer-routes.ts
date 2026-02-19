import { Router, RequestHandler } from "express";
import {
  interviewerController,
  interviewerVerificationController,
  interviewerProfileController,
} from "../config/dependency-injector/interviewer-dependency-injector";
import upload from "../utils/multer";
import authenticateToken from "../middlewares/authenticated-routes";
import { isInterviewer } from "../middlewares/role-auth";
import { restrictBlockedUser } from "../middlewares/block-check";

let router = Router();

router.post("/signUp", interviewerController.signUp.bind(interviewerController));
router.post("/resendOtp", interviewerController.resendOtp.bind(interviewerController));
router.post("/createUser", interviewerController.createUser.bind(interviewerController));
router.post("/login", interviewerController.login.bind(interviewerController));
router.post("/logout", interviewerController.logout.bind(interviewerController));
router.post("/verifyEmail", interviewerController.verifyEmail.bind(interviewerController));
router.post("/verifyResetOtp", interviewerController.verifyResetOtp.bind(interviewerController));
router.post("/forgotResendOtp", interviewerController.forgotResendOtp.bind(interviewerController));
router.post("/resetPassword", interviewerController.resetPassword.bind(interviewerController));
router.post("/googleLogin", interviewerController.doGoogleLogin.bind(interviewerController));

// verification part
router.post(
  "/verificationRequest",
  upload.fields([
    { name: "degreeCertificate", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  interviewerVerificationController.submitRequest.bind(interviewerVerificationController),
);

router.get(
  "/getVerificationByEmail/:email",
  interviewerVerificationController.getRequestByEmail.bind(interviewerVerificationController),
);

// profile management part
router.get(
  "/profile",
  authenticateToken as RequestHandler,      // ✅
  restrictBlockedUser as RequestHandler,    // ✅
  isInterviewer as RequestHandler,          // ✅
  interviewerProfileController.getProfile.bind(interviewerProfileController),
);

router.put(
  "/profile",
  authenticateToken as RequestHandler,      // ✅
  restrictBlockedUser as RequestHandler,    // ✅
  isInterviewer as RequestHandler,          // ✅
  upload.single("profilePic"),
  interviewerProfileController.updateProfile.bind(interviewerProfileController),
);

router.put(
  "/profile/password",
  authenticateToken as RequestHandler,      // ✅
  restrictBlockedUser as RequestHandler,    // ✅
  isInterviewer as RequestHandler,          // ✅
  interviewerProfileController.updatePassword.bind(interviewerProfileController),
);

const interviewerRoutes = router;
export default interviewerRoutes;