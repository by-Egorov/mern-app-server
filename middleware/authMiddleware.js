import jwt from 'jsonwebtoken'

function authMiddleware(req, res, next) {
  if (req.method === 'OPTIONS') {
   return next()
  }

  try {
    const authorizationHeader = req.headers.authorization

    if (!authorizationHeader) {
      return res.status(403).json({ message: 'Пользователь не авторизован' })
    }
    const token = req.headers.authorization.split(' ')[1]
    if (!token) {
      return res.status(403).json({ message: 'Пользователь не авторизован' })
    }
    const decodedData = jwt.verify(token, secret123)
    req.user = decodedData
    next()
  } catch (e) {
    console.log(e)
    return res.status(403).json({ message: 'Пользователь не авторизован' })
  }
}

export default authMiddleware
