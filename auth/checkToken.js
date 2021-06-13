import jwt from 'jsonwebtoken';

export const checkToken = (req, res, next) => {
  let tokenId = req.header('Authorization');
  if (!tokenId) {
    return res.json({
      data: { details: [{ message: 'Token invalid' }] },
      errorStatus: true,
    });
  }
  try {
    tokenId = tokenId.split('Bearer ')[1];
    const checkToken = jwt.verify(tokenId, process.env.SECRET_TOKEN);
    req.user = checkToken.user;
    next();
  } catch (error) {
    return res.json({
      data: { details: [{ message: 'Token invalid' }] },
      errorStatus: true,
    });
  }
};
