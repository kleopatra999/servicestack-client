export interface IReturnVoid {
    createResponse(): void;
}
export interface IReturn<T> {
    createResponse(): T;
}
export declare class ResponseError {
    errorCode: string;
    fieldName: string;
    message: string;
    meta: {
        [index: string]: string;
    };
}
export declare class ResponseStatus {
    errorCode: string;
    message: string;
    stackTrace: string;
    errors: ResponseError[];
    meta: {
        [index: string]: string;
    };
}
export interface IAuthTokens {
    provider?: string;
    userId?: string;
    accessToken?: string;
    accessTokenSecret?: string;
    refreshToken?: string;
    refreshTokenExpiry?: string;
    requestToken?: string;
    requestTokenSecret?: string;
    items?: {
        [index: string]: string;
    };
}
export declare class AuthUserSession {
    referrerUrl: string;
    id: string;
    userAuthId: string;
    userAuthName: string;
    userName: string;
    twitterUserId: string;
    twitterScreenName: string;
    facebookUserId: string;
    facebookUserName: string;
    firstName: string;
    lastName: string;
    displayName: string;
    company: string;
    email: string;
    primaryEmail: string;
    phoneNumber: string;
    birthDate: string;
    birthDateRaw: string;
    address: string;
    address2: string;
    city: string;
    state: string;
    country: string;
    culture: string;
    fullName: string;
    gender: string;
    language: string;
    mailAddress: string;
    nickname: string;
    postalCode: string;
    timeZone: string;
    requestTokenSecret: string;
    createdAt: string;
    lastModified: string;
    roles: string[];
    permissions: string[];
    isAuthenticated: boolean;
    fromToken: boolean;
    profileUrl: string;
    sequence: string;
    tag: number;
    authProvider: string;
    providerOAuthAccess: IAuthTokens[];
}
export declare class ThrowValidationResponse {
    age: number;
    required: string;
    email: string;
    responseStatus: ResponseStatus;
}
export declare class CreateJwtResponse {
    token: string;
    responseStatus: ResponseStatus;
}
export declare class HelloResponse {
    result: string;
}
export declare class HelloTypes implements IReturn<HelloTypes> {
    string: string;
    bool: boolean;
    int: number;
    createResponse(): HelloTypes;
    getTypeName(): string;
}
export declare class TestAuthResponse {
    userId: string;
    sessionId: string;
    userName: string;
    displayName: string;
    responseStatus: ResponseStatus;
}
export declare class EchoTypes implements IReturn<EchoTypes> {
    byte: number;
    short: number;
    int: number;
    long: number;
    uShort: number;
    uInt: number;
    uLong: number;
    float: number;
    double: number;
    decimal: number;
    string: string;
    dateTime: string;
    timeSpan: string;
    dateTimeOffset: string;
    guid: string;
    char: string;
    createResponse(): EchoTypes;
    getTypeName(): string;
}
export declare class AuthenticateResponse {
    userId: string;
    sessionId: string;
    userName: string;
    displayName: string;
    referrerUrl: string;
    bearerToken: string;
    refreshToken: string;
    responseStatus: ResponseStatus;
    meta: {
        [index: string]: string;
    };
}
export declare class ThrowValidation implements IReturn<ThrowValidationResponse> {
    age: number;
    required: string;
    email: string;
    createResponse(): ThrowValidationResponse;
    getTypeName(): string;
}
export declare class CreateJwt extends AuthUserSession implements IReturn<CreateJwtResponse> {
    jwtExpiry: string;
    createResponse(): CreateJwtResponse;
    getTypeName(): string;
}
export declare class Hello implements IReturn<HelloResponse> {
    name: string;
    title: string;
    createResponse(): HelloResponse;
    getTypeName(): string;
}
export declare class HelloReturnVoid implements IReturnVoid {
    id: number;
    createResponse(): void;
    getTypeName(): string;
}
export declare class ReturnString implements IReturn<string> {
    data: string;
    createResponse(): string;
    getTypeName(): string;
}
export declare class ReturnBytes implements IReturn<Uint8Array> {
    data: Uint8Array;
    createResponse(): Uint8Array;
    getTypeName(): string;
}
export declare class ReturnStream implements IReturn<Blob> {
    data: Uint8Array;
    createResponse(): Blob;
    getTypeName(): string;
}
export declare class TestAuth implements IReturn<TestAuthResponse> {
    createResponse(): TestAuthResponse;
    getTypeName(): string;
}
export declare class Authenticate implements IReturn<AuthenticateResponse> {
    provider: string;
    state: string;
    oauth_token: string;
    oauth_verifier: string;
    userName: string;
    password: string;
    rememberMe: boolean;
    continue: string;
    nonce: string;
    uri: string;
    response: string;
    qop: string;
    nc: string;
    cnonce: string;
    useTokenCookie: boolean;
    accessToken: string;
    accessTokenSecret: string;
    meta: {
        [index: string]: string;
    };
    createResponse(): AuthenticateResponse;
    getTypeName(): string;
}
