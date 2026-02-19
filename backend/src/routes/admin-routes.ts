import { Router } from "express";
import {
  adminController,
  adminVerificationController,
  adminDomainController
} from "../config/dependency-injector/admin-dependency-injector";
import authenticateToken from "../middlewares/authenticated-routes";

import { isAdmin } from "../middlewares/role-auth";

let router = Router();

router.post("/login", adminController.login.bind(adminController));
router.post("/logout", authenticateToken, isAdmin, adminController.logout.bind(adminController));

//get all users and interviewers
router.get(
  "/getAllUsers",
  authenticateToken,
  isAdmin,
  adminController.getAllUsers.bind(adminController),
);
router.get(
  "/getAllInterviewers",
  authenticateToken,
  isAdmin,
  adminController.getAllInterviewers.bind(adminController),
);

//block or unblock
router.get(
  "/blockUser/:email",
  authenticateToken,
  isAdmin,
  adminController.blockUser.bind(adminController),
);
router.get(
  "/blockInterviewer/:email",
  authenticateToken,
  isAdmin,
  adminController.blockInterviewer.bind(adminController),
);

//verification  routes
router.get(
  "/request/:email",
  isAdmin,
  adminVerificationController.getRequestData.bind(adminVerificationController),
);

router.get(
  "/requests",
  isAdmin,
  adminVerificationController.getAllRequests.bind(adminVerificationController),
);

router.post(
  "/approveRequest",
  isAdmin,
  adminVerificationController.approveRequest.bind(adminVerificationController),
);

//domain routes

router.post(
  "/domain",
  authenticateToken,
  isAdmin,
  adminDomainController.createDomain.bind(adminDomainController),
);

router.get(
  "/domains",
  authenticateToken,
  isAdmin,
  adminDomainController.getAllDomainsPaginated.bind(adminDomainController),
);

router.get(
  "/domain/:domainId",
  authenticateToken,
  isAdmin,
  adminDomainController.getDomainById.bind(adminDomainController),
);

router.put(
  "/domainStatus/:domainId",
  authenticateToken,
  isAdmin,
  adminDomainController.toggleActiveDomain.bind(adminDomainController),
);

router.put(
  "/domain/:domainId",
  authenticateToken,
  isAdmin,
  adminDomainController.updateDomain.bind(adminDomainController),
);


const adminRoutes = router;

export default adminRoutes;