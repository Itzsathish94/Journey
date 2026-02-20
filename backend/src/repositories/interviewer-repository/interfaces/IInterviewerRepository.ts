import { IInterviewerModel } from "../../../models/interviewer-model";
import { IGenericRepository } from "../../../repositories/generic-repository";

export default interface IInterviewerRepository
  extends IGenericRepository<IInterviewerModel> {
  // ── Auth / creation ────────────────────────────────────────────────
  findByEmail(email: string): Promise<IInterviewerModel | null>;

  createInterviewer(interviewerData: Partial<IInterviewerModel>): Promise<IInterviewerModel>;

  // Google OAuth helper (find or create)
  findOrCreateByGoogle(name: string, email: string): Promise<IInterviewerModel>;

  // Password reset
  updatePasswordByEmail(email: string, hashedPassword: string): Promise<IInterviewerModel | null>;

  // Updates
  updateByEmail(email: string, data: Partial<IInterviewerModel>): Promise<IInterviewerModel | null>;

  // ── Admin / stats ──────────────────────────────────────────────────
  getInterviewerCount(): Promise<number>;

  findByEmailWithPassword(email: string): Promise<IInterviewerModel | null>;

  // ── Common lookups (already in generic repo, no need to repeat)
  // findById(id: string): Promise<IInterviewer | null>;  ← remove duplicate
}