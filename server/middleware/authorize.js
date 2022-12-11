import jwt from "jsonwebtoken";

export const authorize = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      res.status(401);
      throw new Error("unauthenticated user. Authorization token missing.");
    }
    const token = authorization.split(" ")[1];
    const isAuthorized = await jwt.verify(token, process.env.JWT_SECRET);
    if (!isAuthorized) {
      res.status(403);
      throw new Error(
        "Authorization failed. User doesn't have premission for this resources."
      );
    }
    return next();
  } catch (e) {
    res.status(res.statusCode !== 200 ? res.statusCode : 500);
    res.json(e.message);
  }
};
