import StatusCodeEnum from "../../utils/enums/StatusCodeEnum";
import ErrorMessageEnum from "../../utils/enums/errorMessageEnum";
import * as IUserService from './IUserService'
import { IAppServiceProxy } from "../AppServiceProxy";
import Joi from "joi";
import userStore from "../user/userStore";
import IUser from "./../../utils/interfaces/IUser";
import bcrypt from "bcrypt";
import { toError } from "../../utils/interfaces/common";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../env";
import {Role} from "../../utils/enums/role"
import * as RandomUtil from "../../utils/random";
import MessageEnum from "../../utils/enums/messageEnum"
import * as IEmailService from "../email/IEmailService";
import {logger } from "../../utils/enums/logger"





 
export default class UserService implements IUserService.IUserServiceAPI {
  private storage = new userStore();
  public proxy: IAppServiceProxy;
  constructor(proxy: IAppServiceProxy) {
    this.proxy = proxy;
  }

  /*****Generate a Token*****/
  private generateJWT = (user: IUser): string => {
    const payLoad = {
      id: user._id,
      email: user.email,
      role:user.role
    };
    return jwt.sign(payLoad, JWT_SECRET);
  };
  /**
   * @param  {IUserService.IRegisterUserRequest} request
   * Desc: register a user
   * @returns Promise
   */
  public register = async (request: IUserService.IRegisterUserRequest): Promise<IUserService.IRegisterUserResponse> => {
    let response: IUserService.IRegisterUserResponse = {
      status: StatusCodeEnum.UNKNOWN_CODE
    };
    const schema = Joi.object().keys({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().optional(),
      role: Joi.string()
      .valid(...Object.values(Role))
      .optional(),    });
    const params = schema.validate(request, { abortEarly: false });

    const { firstName, lastName, email, role,password} = params.value;
    if (params.error) {
      console.error(params.error);
      response.status = StatusCodeEnum.UNPROCESSABLE_ENTITY;
      response.error = params.error;
      return response;
    }

    const hashPassword = await bcrypt.hash(password, 10);


    const attributes = {
      firstName,
      lastName,
      email,
      role,
      password:hashPassword,
      isSubscribed: false,
      isVerified: false,
      isActive: false,
      meta: {
        createdAt: Date.now(),
      },
    };
    // exist-user
    let existingUser: IUser;
    try {
      existingUser = await this.storage.getByAttributes({email});
    } catch (e) {
      console.error(e);
      response.status = StatusCodeEnum.INTERNAL_SERVER_ERROR;
      response.error = toError(e.message);
      return response;
    }

    if (existingUser && existingUser.email) {
      response.status = StatusCodeEnum.INTERNAL_SERVER_ERROR;
      response.error = "An account with this email already exists.";
      return response;
    }

    let user: IUser;
    try {
      user = await this.storage.register(attributes);
      if (!user) {
        console.error(ErrorMessageEnum.RECORD_NOT_FOUND);
        response = {
          status: StatusCodeEnum.INTERNAL_SERVER_ERROR,
          error: ErrorMessageEnum.RECORD_NOT_FOUND
        };

        return response;
      }
    } catch (e) {
      logger.info('not valid');
      response.status = StatusCodeEnum.INTERNAL_SERVER_ERROR;
      logger.info("this is err")
      return response;
    }
    response.status = StatusCodeEnum.OK;
    response.user = user;
    return response;
  };

  

  // public verifyEmail = async (
  //   request: IUserService.IVerifyUserEmailRequest
  // ): Promise<IUserService.IVerifyUserEmailResponse> => {
  //   const response: IUserService.IVerifyUserEmailResponse = {
  //     status: StatusCodeEnum.UNKNOWN_CODE
  //   };

  //   const schema = Joi.object().keys({
  //     email: Joi.string().required(),
  //     verifyEmailCode: Joi.string().optional(),
  //   });

  //   const params = schema.validate(request);

  //   if (params.error) {
  //     console.error(params.error);
  //     response.status = StatusCodeEnum.UNPROCESSABLE_ENTITY;
  //     response.error = toError(params.error.details[0].message);
  //     response.verified = false;
  //     return response;
  //   }
  //   const {  email, verifyEmailCode } = params.value;

  //   let user: IUser;
  //   try {
  //     const emailCheck = await this.storage.getByAttributes({verifyEmailCode,email:email})
  //     if (!emailCheck ) {
  //       response.status = StatusCodeEnum.BAD_REQUEST;
  //       const errorMsg = ErrorMessageEnum.INVALID_CREDENTIALS;
  //       response.error = toError(errorMsg);
  //       response.verified = false;
  //       return response;
  //     }
  //   } catch (e) {
  //     console.error(e);
  //     response.error = toError(e.message);
  //     response.status = StatusCodeEnum.INTERNAL_SERVER_ERROR;
  //     response.verified = false;
  //     return response;
  //   }
  //   try{
  //     user = await this.storage.verifyEmail(verifyEmailCode);
  //     if(!user){
  //     response.status = StatusCodeEnum.BAD_REQUEST;
  //       const errorMsg = ErrorMessageEnum.INVALID_CREDENTIALS;
  //       response.error = toError(errorMsg);
  //       response.verified = false;
  //       return response;
  //     }
  //   }
  //   catch (e) {
  //     console.error(e);
  //     response.error = toError(e.message);
  //     response.status = StatusCodeEnum.INTERNAL_SERVER_ERROR;
  //     response.verified = false;
  //     return response;
  //   }
  //   response.status = StatusCodeEnum.OK;
  //   response.user = user;
  //   response.token = this.generateJWT(user);
  //   return response;
  // };
  
  // public login = async (
  //   request: IUserService.ILoginUserRequest
  // ): Promise<IUserService.IRegisterUserResponse> => {
  //   const response: IUserService.IRegisterUserResponse = {
  //     status: StatusCodeEnum.UNKNOWN_CODE,
  //   };

  //   const schema = Joi.object().keys({
  //     email: Joi.string().required(),
  //     password:Joi.string().optional()
  //   });

  //   const params = schema.validate(request);

  //   if (params.error) {
  //     console.error(params.error);
  //     response.status = StatusCodeEnum.UNPROCESSABLE_ENTITY;
  //     response.error = toError(params.error.details[0].message);
  //     return response;
  //   }

  //   const { email,password} = params.value;
  //   let user: any;
  //   try {
  //     user = await this.storage.findByEmail(email);
  //     //if user's id is incorrect
  //     if (!user) {
  //       response.status = StatusCodeEnum.BAD_REQUEST;
  //       return response;
  //     }
  //   } catch (e) {
  //     console.error(e);
  //     response.status = StatusCodeEnum.INTERNAL_SERVER_ERROR;
  //     response.error = toError(e.message);
  //     return response;
  //   }
  //   response.status = StatusCodeEnum.OK;
  //   response.user = user;
  //   response.token = this.generateJWT(user);
  //   return response;
  // };



  // public get = async (
  //   request: IUserService.IGetUserRequest
  // ): Promise<IUserService.IGetUserResponse> => {
  //   const response: IUserService.IGetUserResponse = {
  //     status: StatusCodeEnum.UNKNOWN_CODE,
  //   };

  //   const schema = Joi.object().keys({
  //     _id: Joi.string().required(),
  //   });

  //   const params = schema.validate(request);
  //   if (params.error) {
  //     console.error(params.error);
  //     response.status = StatusCodeEnum.UNPROCESSABLE_ENTITY;
  //     response.error = params.error;
  //     return response;
  //   }

  //   const { _id } = params.value;
  //   let user: IUser;
  //   try {
  //     user = await this.storage.getByAttributes({ _id });

  //     //if user's id is incorrect
  //     if (!user) {
  //       const errorMsg = ErrorMessageEnum.INVALID_USER_ID;
  //       response.status = StatusCodeEnum.UNPROCESSABLE_ENTITY;
  //       response.error = toError(errorMsg);
  //       return response;
  //     }
  //   } catch (e) {
  //     console.error(e);
  //     response.status = StatusCodeEnum.UNPROCESSABLE_ENTITY;
  //     response.error = toError(e.message);
  //     return response;
  //   }
  //   response.status = StatusCodeEnum.OK;
  //   response.user = user;
  //   return response;
  // };


  // public update = async (
  //   request: IUserService.IUpdateUserRequest
  // ): Promise<IUserService.IUpdateUserResponse> => {
  //   const response: IUserService.IUpdateUserResponse = {
  //     status: StatusCodeEnum.UNKNOWN_CODE,
  //   };

  //   const schema = Joi.object().keys({
  //     _id: Joi.string().required(),
  //     firstName: Joi.string().required(),
  //     lastName: Joi.string().optional(),
  //     userName: Joi.string().optional(),
  //     email: Joi.string().email().optional(),
  //   });

  //   const params = schema.validate(request);

  //   if (params.error) {
  //     console.error(params.error);
  //     response.status = StatusCodeEnum.UNPROCESSABLE_ENTITY;
  //     response.error = toError(params.error.details[0].message);
  //     return response;
  //   }
  //   const { firstName, lastName, email, _id,userName } = params.value;

  //   let user: IUser;
  //   try {
  //     user = await this.storage.getByAttributes({ _id });
  //     //if user's id is incorrect
  //     if (!user) {
  //       const errorMsg = ErrorMessageEnum.INVALID_USER_ID;
  //       response.status = StatusCodeEnum.UNPROCESSABLE_ENTITY;
  //       response.error = toError(errorMsg);
  //       return response;
  //     }
  //   } catch (e) {
  //     console.error(e);
  //     response.status = StatusCodeEnum.UNPROCESSABLE_ENTITY;
  //     response.error = toError(e.message);
  //     return response;
  //   }

  //   //Save the user to storage
  //   const attributes: IUser = {
  //     firstName,
  //     lastName,
  //     email,
  //     userName,
  //     isVerified: false,

  //     meta: {
  //       updatedAt: Date.now(),
  //       updatedBy: _id
  //     },
  //   };
  //   try {
  //     user = await this.storage.update(_id, {...attributes});
  //   } catch (e) {
  //     console.error(e);
  //     response.status = StatusCodeEnum.UNPROCESSABLE_ENTITY;
  //     response.error = toError(e.message);
  //     return response;
  //   }
  //   response.status = StatusCodeEnum.OK;
  //   response.user = user;
  //   return response;
  // };

  // public delete = async (
  //   request: IUserService.IDeleteUserRequest
  // ): Promise<IUserService.IDeleteUserResponse> => {
  //   const response: IUserService.IDeleteUserResponse = {
  //     status: StatusCodeEnum.UNKNOWN_CODE,
  //   };
  //   const schema = Joi.object().keys({
  //     userId: Joi.string().required(),
  //   });
  //   const params = schema.validate(request);

  //   if (params.error) {
  //     console.error(params.error);
  //     response.status = StatusCodeEnum.UNPROCESSABLE_ENTITY;
  //     response.error = toError(params.error.details[0].message);
  //     return response;
  //   }
  //   const { userId } = params.value;

  //   //exists user and shop
  //   let user;
  //   let shop;
  //   try {
  //     user = await this.storage.getByAttributes({ _id: userId });
  //     shop = await this.shopStore.getByAttributes({ sellerId: userId });
  //     if (!user) {
  //       const errorMsg = ErrorMessageEnum.INVALID_CREDENTIALS;
  //       response.status = StatusCodeEnum.BAD_REQUEST;
  //       response.error = toError(errorMsg);
  //       return response;
  //     }
  //   } catch (e) {
  //     console.error(e);
  //     response.status = StatusCodeEnum.INTERNAL_SERVER_ERROR;
  //     response.error = toError(e.message);
  //     return response;
  //   }
  //   if (user?.isActive == false) {
  //     const errorMsg = ErrorMessageEnum.RECORD_NOT_FOUND;
  //     response.status = StatusCodeEnum.NOT_FOUND;
  //     response.error = toError(errorMsg);
  //     return response;
  //   }
  //   try {
  //     await this.storage.update(user._id, { isActive: false });
  //     if (user.isActive == false || shop?.sellerId == userId) {
  //       await this.storage.update(shop._id, { isActive: false });
  //     }
  //   } catch (e) {
  //     console.error(e);
  //     response.status = StatusCodeEnum.INTERNAL_SERVER_ERROR;
  //     response.error = toError(e.message);
  //     return response;
  //   }

  //   response.status = StatusCodeEnum.OK;
  //   response.success = true;
  //   return response;
  // };

  public login = async (
    request: IUserService.ILoginUserRequest
  ): Promise<IUserService.ILoginUserResponse> => {
    const response: IUserService.ILoginUserResponse = {
      status: StatusCodeEnum.UNKNOWN_CODE,
    };
    const schema = Joi.object().keys({
      email: Joi.string().trim().optional(),
      password: Joi.string().trim().optional(),
    });
    const params = schema.validate(request);

    if (params.error) {
      console.error(params.error);
      response.status = StatusCodeEnum.UNPROCESSABLE_ENTITY;
      response.error = toError(params.error.details[0].message);
      return response;
    }

    let {email, password } = params.value;

    let user: IUser;
    try {
      //get user bu email id to check it exist or not
      user = await this.storage.getByAttributes({
        email
      });
      //if credentials are incorrect
      if (!user) {
      const errorMsg = ErrorMessageEnum.INVALID_CREDENTIALS;
        response.status = StatusCodeEnum.UNAUTHORIZED;
        response.error = toError(errorMsg);
        logger.info("this is errorr")
        return response;
      }
    } catch (e) {
      console.error(e);
      response.status = StatusCodeEnum.INTERNAL_SERVER_ERROR;
      response.error = toError(e.message);
      return response;
    }

    if (user?.isActive === true) {
      const errorMsg = MessageEnum.ACCOUNT_SUSPENDED;
      response.status = StatusCodeEnum.UNAUTHORIZED;
      response.error = toError(errorMsg);
      return response;
    }

    const isValid = await bcrypt.compare(password, user?.password);

    if (!isValid || !user?.password) {
      const errorMsg = ErrorMessageEnum.INVALID_CREDENTIALS;
      response.status = StatusCodeEnum.UNAUTHORIZED;
      response.error = toError(errorMsg);
      return response;
    }
    // if(user?.isVerified == false){
    //   const errorMsg = ErrorMessageEnum.INVALID_CREDENTIALS;
    //   response.status = StatusCodeEnum.UNAUTHORIZED;
    //   response.error = toError(errorMsg);
    //   return response;

    // }
    // const isVali = await this.storage.getByAttributes({ email });
    // if (!isVali || !user?.email) {
    //   const errorMsg = ErrorMessageEnum.INVALID_CREDENTIALS;
    //   response.status = StatusCodeEnum.UNAUTHORIZED;
    //   response.error = toError(errorMsg);
    //   return response;
    // }
    const verifyEmailCode = RandomUtil.generateRandomNumber(6).toString();

    

    if (user) {
      try {
        await this.storage.setVerifyEmailCode(user._id, verifyEmailCode);
        const request: IEmailService.ISendUserEmailVerificationEmailRequest = {
          toAddress: user?.email,
          firstName: user?.firstName,
          lastName: user?.lastName,
          verifyEmailUrl: verifyEmailCode,
        };

        await this.proxy.email.sendUserEmailVerificationEmail(request);
      } catch (e) {
        console.error(e);
        response.status = StatusCodeEnum.INTERNAL_SERVER_ERROR;
        response.error = toError(e.message);
        return response;
      }
    }
    response.status = StatusCodeEnum.OK;
    response.message = "otp sent to email please verify to login"
    response.token = this.generateJWT(user);
    response.user = user;
    return response;
  };
 

}
