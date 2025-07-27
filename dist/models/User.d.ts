import { User, UserWithoutPassword, LoginRequest, SignupRequest } from '../types/auth';
export declare class UserModel {
    static create(userData: SignupRequest): Promise<UserWithoutPassword>;
    static findByEmail(email: string): Promise<User | null>;
    static findById(id: number): Promise<UserWithoutPassword | null>;
    static authenticate(loginData: LoginRequest): Promise<UserWithoutPassword>;
    static updateLastLogin(id: number): Promise<void>;
    static findAll(): Promise<UserWithoutPassword[]>;
    static delete(id: number): Promise<void>;
    static softDelete(id: number): Promise<void>;
    static updateRole(id: number, role: 'admin' | 'user'): Promise<UserWithoutPassword>;
}
export default UserModel;
//# sourceMappingURL=User.d.ts.map