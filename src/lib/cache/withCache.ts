// 1. check if request cached
// get from Cache layer search 'GET:/products' : '[{},{},{},{}]'
import {cacheProvider} from "./init";
import {NextFunction, Request, Response} from "express";

export function withCache(ttl = 3600) {
    return async (req: Request, res: Response, next: NextFunction) => {
        // req.url >> /rgister
        // req.orignalUrl /api/v1/auth/rgister
        let key = `${req.method}:${req.originalUrl}`;
        const cached = await cacheProvider.get(key);// nil | data
        if (cached) {
            res.setHeader('X-Cache', 'HIT');
            return res.json(JSON.parse(cached));
        }
        // res.json() >> send a client response
        // intercept - modify
        // res.json({message,success,data}) >>  set data to cache + send a client response
        const originalJson = res.json.bind(res); // res()
        res.json = ((body) => {
            res.setHeader('X-Cache', 'MISS');
            cacheProvider.set(key, JSON.stringify(body), ttl);
            return originalJson(body);
        });
        next();
    }
}

// originalJson == res == res.json() >> old
// save old res.json() before modify
// res.json()
//  await cacheProvider.set(key, body);
//  return res.json(body);

// round
// await cacheProvider.set(key, body);
// return res.json(body);
