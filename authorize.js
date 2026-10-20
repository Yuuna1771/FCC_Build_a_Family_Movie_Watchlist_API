
export function authorizeModification(req, res, next) {
  if (
    req.user.role !== "parent" &&
    String(req.params.userId) !== String(req.user.id)
  ) {
    return res.status(403).json({
      error: "Access denied"
    });
  }

  next();
}
