import { JwtPayload } from 'jsonwebtoken'

declare global {
  namespace Express {
    interface Request {
      jwt?: jwt.JwtPayload | string
    }
  }
}