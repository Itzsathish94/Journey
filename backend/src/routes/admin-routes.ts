import { Router } from "express";
import {
  adminController,
  adminVerificationController,
  adminDomainController,
  adminSkillController,
  adminIndustryController
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
router.put(
  "/blockUser/:email",
  authenticateToken,
  isAdmin,
  adminController.blockOrUnblockUser.bind(adminController),
);
router.put(
  "/blockInterviewer/:email",
  authenticateToken,
  isAdmin,
  adminController.blockOrUnblockInterviewer.bind(adminController),
);

//verification  routes
router.get(
  "/request/:email",
  authenticateToken,
  isAdmin,
  adminVerificationController.getRequestData.bind(adminVerificationController),
);

router.get(
  "/requests",
  authenticateToken,
  isAdmin,
  adminVerificationController.getAllRequests.bind(adminVerificationController),
);

router.post(
  "/approveRequest",
  authenticateToken,
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

// skill routes

router.post(
  "/skill",
  authenticateToken,
  isAdmin,
  adminSkillController.createSkill.bind(adminSkillController),
);

router.get(
  "/skills",
  authenticateToken,
  isAdmin,
  adminSkillController.getAllSkillsPaginated.bind(adminSkillController),
);

router.get(
  "/skill/:skillId",
  authenticateToken,
  isAdmin,
  adminSkillController.getSkillById.bind(adminSkillController),
);

router.put(
  "/skillStatus/:skillId",
  authenticateToken,
  isAdmin,
  adminSkillController.toggleActiveSkill.bind(adminSkillController),
);

router.put(
  "/skill/:skillId",
  authenticateToken,
  isAdmin,
  adminSkillController.updateSkill.bind(adminSkillController),
);

// industry routes

router.post(
  "/industry",
  authenticateToken,
  isAdmin,
  adminIndustryController.createIndustry.bind(adminIndustryController),
);

router.get(
  "/industries",
  authenticateToken,
  isAdmin,
  adminIndustryController.getAllIndustriesPaginated.bind(adminIndustryController),
);

router.get(
  "/industry/:industryId",
  authenticateToken,
  isAdmin,
  adminIndustryController.getIndustryById.bind(adminIndustryController),
);

router.put(
  "/industryStatus/:industryId",
  authenticateToken,
  isAdmin,
  adminIndustryController.toggleActiveIndustry.bind(adminIndustryController),
);

router.put(
  "/industry/:industryId",
  authenticateToken,
  isAdmin,
  adminIndustryController.updateIndustry.bind(adminIndustryController),
);
const adminRoutes = router;

export default adminRoutes;