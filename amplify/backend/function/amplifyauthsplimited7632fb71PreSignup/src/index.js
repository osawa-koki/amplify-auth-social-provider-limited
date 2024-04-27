"use strict";
/**
 * @fileoverview
 *
 * This CloudFormation Trigger creates a handler which awaits the other handlers
 * specified in the `MODULES` env var, located at `./${MODULE}`.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The names of modules to load are stored as a comma-delimited string in the
 * `MODULES` env var.
 */
const moduleNames = ((_a = process.env.MODULES) !== null && _a !== void 0 ? _a : '').split(',');
/**
 * The array of imported modules.
 */
const modules = moduleNames.map((name) => require(`./${name}`));
/**
 * This async handler iterates over the given modules and awaits them.
 *
 * @see https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html#nodejs-handler-async
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 *
 */
exports.handler = (event, context) => __awaiter(void 0, void 0, void 0, function* () {
    /**
     * Instead of naively iterating over all handlers, run them concurrently with
     * `await Promise.all(...)`. This would otherwise just be determined by the
     * order of names in the `MODULES` var.
     */
    yield Promise.all(modules.map((module) => module.handler(event, context)));
    return event;
});
