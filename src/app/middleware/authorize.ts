export default function authorize(admin: boolean) {
  return (req, res, next) => {
    const { user } = req;

    if (user && (admin === user.isAdmin)) {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden' });
    }
  };
}
