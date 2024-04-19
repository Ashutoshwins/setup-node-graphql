import shortid from "shortid";
// import { StatusEnum } from "../utils/enums/statusEnum";
import { Role } from "../utils/enums/role";
import MetaData from "./meta.model";
import { boolean } from "joi";

export default {
    _id: {
        type: String,
        required: true,
        default: shortid.generate
    },
    firstName: {
        type: String,
        required: false,
    },
    lastName: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: false
    },
    role: {
        type: String,
        enum: Object.values(Role),
        required: false

    },
    isActive: {
        type: Boolean,
        // enum: Object.values(StatusEnum),
        required: false,
        // default: StatusEnum.ACTIVE
    },
    verifyEmailCode: {
        type: String,
        required: false,
        default: null,

    },
    emailVerifiedAt: {
        type: Number,
        required: false,
        default: null,
    },
    isVerified: {
        type: Boolean,
        required: false,
    },
    isSubscribed: {
        type: Boolean,
        required: false,
      },
    meta: MetaData
}