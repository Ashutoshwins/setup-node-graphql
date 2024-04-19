import { ApolloError } from "apollo-server-express";
export const useAuthValidator = (context) => {
  const { user: currentUser } = context.req;
  if (currentUser.error) {
    throw new ApolloError(currentUser.error, currentUser.code, {
      errors: currentUser?.error?.message || [],
    });
  }
  if (!currentUser.id) {
    throw new ApolloError("Authentication is required", "401");
  }
};
