import { IVerificationModel } from "../../models/verification-model";
import { VerificationRequestDTO } from "../../dto/admin-dto/verification-request-dto";

export function mapVerificationToDTO(
  request: IVerificationModel,
): VerificationRequestDTO {
  return {
    id: request._id.toString(),
    username: request.username,
    email: request.email,
    status: request.status,
  };
}

export function mapVerificationArrayToDTO(
  requests: IVerificationModel[],
): VerificationRequestDTO[] {
  return requests.map(mapVerificationToDTO);
}