const getEnv = (key:string,defaultValue?:string):string=>{
    const value = process.env[key] || defaultValue;

    if(value===undefined){
        throw new Error(`Missing environment variable ${key}`);
    }
    return value;
}

export const NODE_ENV = getEnv("NODE_ENV","development");
export const MONGO_URI = getEnv("MONGO_URI");
export const JWT_ACCESS_SECRET = getEnv("JWT_ACCESS_SECRET");
export const JWT_REFRESH_SECRET = getEnv("JWT_REFRESH_SECRET");
export const GOOGLE_CLIENT_ID = getEnv("GOOGLE_CLIENT_ID");
export const GOOGLE_CLIENT_SECRET = getEnv("GOOGLE_CLIENT_SECRET");
export const EMAIL_USER = getEnv("EMAIL_USER");
export const EMAIL_PASS = getEnv("EMAIL_PASS");
export const PORT = getEnv("PORT");
export const FRONTEND_URL = getEnv("FRONTEND_URL");






