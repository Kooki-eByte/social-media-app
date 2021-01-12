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
Object.defineProperty(exports, "__esModule", { value: true });
const flagpole_1 = require("flagpole");
require("dotenv").config();
const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;
const suite = flagpole_1.default("Basic Smoke Test of Site");
suite
    .scenario("Homepage Loads", "html")
    .open("/")
    .next((context) => __awaiter(void 0, void 0, void 0, function* () {
    context
        .assert("HTTP Status equals 200", context.response.statusCode)
        .equals(200);
    context.response.loadTime
        .assert("Load time was less than 1 second")
        .lessThan(1000);
}));
suite
    .scenario("Homepage Loads", "html")
    .open("/login")
    .next((context) => __awaiter(void 0, void 0, void 0, function* () {
    context
        .assert("HTTP Status equals 200", context.response.statusCode)
        .equals(200);
    context.response.loadTime
        .assert("Load time was less than 1 second")
        .lessThan(1000);
}));
suite
    .scenario("Homepage Loads", "html")
    .open("/register")
    .next((context) => __awaiter(void 0, void 0, void 0, function* () {
    context
        .assert("HTTP Status equals 200", context.response.statusCode)
        .equals(200);
    context.response.loadTime
        .assert("Load time was less than 1 second")
        .lessThan(1000);
}));
suite
    .scenario("Homepage Loads", "html")
    .open("/posts/:postId")
    .next((context) => __awaiter(void 0, void 0, void 0, function* () {
    context
        .assert("HTTP Status equals 200", context.response.statusCode)
        .equals(200);
    context.response.loadTime
        .assert("Load time was less than 1 second")
        .lessThan(1000);
}));
suite
    .scenario("Some Other Page Loads", "browser")
    .open("/login")
    .next((context) => __awaiter(void 0, void 0, void 0, function* () {
    yield context.type('input[name="username"]', USERNAME);
    yield context.type('input[name="password"]', PASSWORD);
    yield context.click('button[name="loginButton"]');
    yield context.waitForNavigation();
    yield context.screenshot("test-images/example.png");
}));
