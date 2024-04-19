import { config } from "dotenv";

config();
export const DEBUG_ENABLED = true;
export const MONGO_DB_CONNECTION_STRING = process.env.MONGO_DB_CONNECTION_STRING || "mongodb://localhost:27017/Node";
export const JWT_SECRET = process.env.JWT_SECRET || "thiisecret865776rr4e*&&*e";
export const PORT = process.env.PORT || 4003;
export const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
export const SENDGRID_FROM_KEY = process.env.SENDGRID_FROM_KEY;
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
