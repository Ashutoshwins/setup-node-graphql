import IUser from "../interfaces/IUser";
import StatusCodeEnum from "../enums/StatusCodeEnum";

export interface IRequest {
  user?: IUser;
}

export interface IResponse {
  status?: StatusCodeEnum;
  error?: IError;
}

export interface IError {
  message: string;
}

export function toError(message: string): IError {
  const error: IError = {
    message
  };
  return error;
}
