import { Request, Response, NextFunction } from "express";

const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {

    console.log("AUTHORIZE ROLES RUNNING");
    console.log("USER:", req.user);

    if (!req.user) {
      return res.status(401).json({
        message: "User not authenticated",
      });
    }

    if (!req.user|| !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    next();
  };
};

export default authorizeRoles;