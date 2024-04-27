"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const ssm = new aws_sdk_1.default.SSM();
const getSecret = (secretName) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const secretPath = process.env[secretName];
    if (secretPath == null)
        return null;
    const { Parameter } = yield ssm.getParameter({
        Name: secretPath,
        WithDecryption: true
    }).promise();
    return (_a = Parameter === null || Parameter === void 0 ? void 0 : Parameter.Value) !== null && _a !== void 0 ? _a : null;
});
exports.handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    const { email } = event.request.userAttributes;
    const ALLOWED_EMAIL_REGEX_LIST = (_c = (_b = (yield getSecret('ALLOWED_EMAIL_REGEX_LIST'))) === null || _b === void 0 ? void 0 : _b.split(',').map((a) => a.trim())) !== null && _c !== void 0 ? _c : [];
    const isAllowed = ALLOWED_EMAIL_REGEX_LIST.some((regex) => new RegExp(regex).test(email));
    if (!isAllowed) {
        throw new Error(`\nallowed email regex list: ${ALLOWED_EMAIL_REGEX_LIST.map((a) => `'${a}'`).join(', ')}`);
    }
    return event;
});
