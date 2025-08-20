import { v4 as uuidv4 } from 'uuid';

const attachRequestId = (req, res, next) => {
  req.requestId = uuidv4();
  res.setHeader('X-Request-Id', req.requestId);
  next();
};

export default attachRequestId;