/// <reference path="./dtos/test.interfaces.d.ts" />

import * as dtos from "./dtos/techstacks.dtos";
import { 
    ResponseStatus, ResponseError,
    Authenticate,AuthenticateResponse,
    TestAuth, TestAuthResponse,
    CreateJwt,CreateJwtResponse
} from "./dtos/test.dtos";
import * as chai from "chai";
import { 
    JsonServiceClient,
    ErrorResponse,
    appendQueryString,
} from  '../src/index';

const expect = chai.expect;
const assert = chai.assert;

const createJwt = (opt:any={}) : CreateJwt => {
    const request = Object.assign(new CreateJwt(), opt);
    if (!request.userAuthId)
        request.userAuthId = "1";
    if (!request.displayName)
        request.displayName = "test jwt";
    if (!request.email)
        request.email = "test@auth.com";
    return request;
}

const TEST_URL = "http://test.servicestack.net";

describe ('JsonServiceClient Auth Tests', () => {

    var client : JsonServiceClient;

    beforeEach(() => {
        client = new JsonServiceClient(TEST_URL);
    });


    it ("Can auth with JWT", async () => {

        const request = createJwt();
        let response = await client.post(request);

        client.bearerToken = response.token;

        let testAuth = await client.get(new TestAuth());
        expect(testAuth.userId).eq("1");
        expect(testAuth.displayName).eq("test jwt");
        expect(testAuth.sessionId).not.empty;
    })

    it ("Does fire onAuthenticationRequired callback on 401", async () => {

        let count = 0;
        client.onAuthenticationRequired = () => {
            count++;
            return Promise.resolve(null);
        }

        try {
            await client.get(new TestAuth());
            assert.fail("should throw");
        } catch (e) {
            var status = (e as ErrorResponse).responseStatus;
            expect(status.errorCode).eq("401");
            expect(status.message).eq("Unauthorized");
            expect(count).eq(1);
        }
    })

    it ("Can use onAuthenticationRequired to auth client", async () => {

        let count = 0;
        client.onAuthenticationRequired = () => {
            count++;
            client.userName = "test";
            client.password = "test";
            return Promise.resolve(null);
        };

        var response = await client.get(new TestAuth());
        expect(count).eq(1);
    })

    it ("Can use onAuthenticationRequired to fetch new token", async () => {

        let count = 0;
        client.onAuthenticationRequired = async () => {
            count++;
            
            var authClient = new JsonServiceClient(TEST_URL);
            authClient.userName = "test";
            authClient.password = "test";
            const response = await authClient.get(new Authenticate());
            client.bearerToken = response.bearerToken;
        };

        var response = await client.get(new TestAuth());
        expect(count).eq(1);
    })

    it ("Can use onAuthenticationRequired to fetch new token after expired token", async () => {

        let count = 0;
        client.onAuthenticationRequired = async () => {
            count++;
            let createFreshJwt = createJwt();
            const freshJwt = await client.post(createFreshJwt);
            client.bearerToken = freshJwt.token;
        };

        let createExpiredJwt = createJwt();
        createExpiredJwt.jwtExpiry = "2000-01-01";
        const expiredJwt = await client.post(createExpiredJwt);

        client.bearerToken = expiredJwt.token;
        var response = await client.get(new TestAuth());
        expect(count).eq(1);
    })

    it ("Can use refreshToken to fetch new token after expired token", async () => {

        let count = 0;
        var authClient = new JsonServiceClient(TEST_URL);
        client.userName = "test";
        client.password = "test";
        var authResponse = await client.post(new Authenticate());

        client.refreshToken = authResponse.refreshToken;
        client.setCredentials(null,null);

        let createExpiredJwt = createJwt();
        createExpiredJwt.jwtExpiry = "2000-01-01";
        const expiredJwt = await client.post(createExpiredJwt);

        client.bearerToken = expiredJwt.token;
        var response = await client.get(new TestAuth());

        expect(client.bearerToken).not.eq(expiredJwt.token);
    })

    it ("Can reauthenticate after an auto refresh access token", async () => {

        var client = new JsonServiceClient(TEST_URL);
        var auth = new Authenticate();
        auth.provider = "credentials";
        auth.userName = "test";
        auth.password = "test";
        var authResponse = await client.post(auth);

        var refreshToken = authResponse.refreshToken;

        let createExpiredJwt = createJwt();
        createExpiredJwt.jwtExpiry = "2000-01-01";
        const expiredJwt = await client.post(createExpiredJwt);
        var bearerToken = expiredJwt.token;

        //Clear existing User Session
        var logout = new Authenticate();
        logout.provider = "logout";
        await client.post(logout);

        client = new JsonServiceClient(TEST_URL);
        client.bearerToken = bearerToken;
        client.refreshToken = refreshToken;

        auth.password = "notvalid";
        try {
            await client.post(auth);
            assert.fail("should throw");
        } catch(e){
            var status = (e as ErrorResponse).responseStatus;
            expect(status.errorCode).eq("Unauthorized");
            expect(status.message).eq("Invalid UserName or Password");
        }
    })

});