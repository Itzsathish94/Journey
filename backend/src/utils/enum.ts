
export enum Roles{
    ADMIN='ADMIN',
    INTERVIEWER='INTERVIEWER',
    USER='USER'
}

export enum ApplicationStatus{
    PENDING='pending',
    APPROVED='approved',
    REJECTED="rejected"
}

export enum StatusCode {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    UNPROCESSABLE_ENTITY = 422,
    INTERNAL_SERVER_ERROR = 500,
    SERVICE_UNAVAILABLE = 503,
  }
  
 
  
  export enum Model {
    ADMIN = "ADMIN",
    USER = "USER",
    INTERVIEWER = "INTERVIEWER",
  }