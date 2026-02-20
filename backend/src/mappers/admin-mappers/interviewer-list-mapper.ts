

import { InterviewerDTO } from "../../dto/admin-dto/interviewer-list-dto";
import { IInterviewer } from "../../models/interviewer-model";

export const mapInterviewerToDTO = (interviewer: IInterviewer): InterviewerDTO => {
  return {
    id: interviewer._id.toString(),
    name: interviewer.username,
    email: interviewer.email,
    isVerified: interviewer.isVerified,
    isBlocked: interviewer.isBlocked,
    createdAt: new Date(interviewer.createdAt).toLocaleDateString("en-GB"),
  };
};

export const mapInterviewersToDTO = (
  Interviewers: IInterviewer[],
): InterviewerDTO[] => {
  return Interviewers.map(mapInterviewerToDTO);
};
