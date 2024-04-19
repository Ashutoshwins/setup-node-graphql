/* eslint-disable no-useless-catch */
import { ApolloError } from "apollo-server-express";
import StatusCodeEnum from "../../utils/enums/StatusCodeEnum";
import proxy from "../../services/AppServiceProxy";
import * as IUserService from "../../services/user/IUserService";
// import { useAuthValidator } from "../../middlewares/useauthvalidator";

export default {
  Query: {
  
  },
  

  Mutation: {
    async register(parent, args) {
      const {
        user: { firstName, lastName, email, password ,role},
      } = args;

      const request: IUserService.IRegisterUserRequest = {
        firstName,
        lastName,
        email,
        password,
        role,
      };

      let response: IUserService.IRegisterUserResponse;

      try {
        response = await proxy.user.register(request);

        if (response.status !== StatusCodeEnum.OK) {
          throw new ApolloError(
            response.error.message,
            // response.status.toString()
          );
        }
      } catch (e) {
        throw e;
      }

      return response;
    },

   
    async login(parents, args) {
      const { email, password } = args;

      const request: IUserService.ILoginUserRequest = {
        email,
        password,
      };

      let response: IUserService.ILoginUserResponse = {
        status: StatusCodeEnum.UNKNOWN_CODE,
      };

      try {
        response = await proxy.user.login(request);
        if (response.status !== StatusCodeEnum.OK) {
          throw new ApolloError(
            response.error.message,
            response.status.toString()
          );
        }
      } catch (e) {
        throw e;
      }
      return response;
    },

  
  },
};
