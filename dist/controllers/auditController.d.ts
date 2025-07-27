import { Request, Response } from 'express';
declare class AuditController {
    static getAllLogs(req: Request, res: Response): Promise<void>;
    static getLogsByProduct(req: Request, res: Response): Promise<void>;
    static getLogsByUser(req: Request, res: Response): Promise<void>;
    static getLogsByAction(req: Request, res: Response): Promise<void>;
    static getRecentLogs(req: Request, res: Response): Promise<void>;
    static getLogsSummary(req: Request, res: Response): Promise<void>;
    static getLogsByDateRange(req: Request, res: Response): Promise<void>;
}
export default AuditController;
//# sourceMappingURL=auditController.d.ts.map