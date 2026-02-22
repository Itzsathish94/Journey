// Payload used when creating an interviewer from the app layer
export interface IInterviewerDTO {
  username: string;
  email: string;
  password: string;
  role: "USER" | "INTERVIEWER" | "ADMIN";
  isVerified?: boolean;
}