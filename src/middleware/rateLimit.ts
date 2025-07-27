import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

// Custom rate limit error handler
export const createRateLimitErrorHandler = (endpoint: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const originalSend = res.send;
    
    res.send = function(data) {
      if (res.statusCode === 429) {
        console.warn(`Rate limit exceeded for ${endpoint} from IP: ${req.ip}`);
        
        // Log additional information for debugging
        console.log({
          endpoint,
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          timestamp: new Date().toISOString(),
          headers: req.headers
        });
      }
      
      return originalSend.call(this, data);
    };
    
    next();
  };
};

// Rate limit configuration factory
export const createRateLimit = (options: {
  windowMs: number;
  max: number;
  message: string;
  endpoint?: string;
}) => {
  const limiter = rateLimit({
    windowMs: options.windowMs,
    max: options.max,
    message: {
      success: false,
      message: options.message,
      endpoint: options.endpoint
    },
    standardHeaders: true,
    legacyHeaders: false,
    // Custom handler for rate limit exceeded
    handler: (req: Request, res: Response) => {
      console.warn(`Rate limit exceeded for ${options.endpoint || 'unknown'} from IP: ${req.ip}`);
      
      res.status(429).json({
        success: false,
        message: options.message,
        endpoint: options.endpoint,
        retryAfter: Math.ceil(options.windowMs / 1000)
      });
    }
  });
  
  return limiter;
}; 