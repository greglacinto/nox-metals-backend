import { JWTPayload, UserWithoutPassword } from '../types/auth';
export declare class JWTService {
    static generateToken(user: UserWithoutPassword): string;
    static verifyToken(token: string): JWTPayload;
    static decodeToken(token: string): JWTPayload | null;
    static isTokenExpired(token: string): boolean;
}
export default JWTService;
//# sourceMappingURL=jwt.d.ts.map