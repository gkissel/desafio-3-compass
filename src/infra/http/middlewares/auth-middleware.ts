import { NextFunction, Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'

import { env } from '../../env'

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res.status(401).json({ message: 'No token provided' })
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET)
    req.body.userId = decoded.sub
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}
