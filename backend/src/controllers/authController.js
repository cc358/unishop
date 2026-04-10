const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// 生成 JWT
function generateToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

// 注册
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    // 检查邮箱是否已存在
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return res.status(400).json({ message: '该邮箱已注册' })
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10)

    // 创建用户
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
      select: { id: true, name: true, email: true },
    })

    const token = generateToken(user.id)
    res.status(201).json({ user, token })
  } catch (err) {
    next(err)
  }
}

// 登录
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(400).json({ message: '邮箱或密码错误' })
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return res.status(400).json({ message: '邮箱或密码错误' })
    }

    const token = generateToken(user.id)
    res.json({
      user: { id: user.id, name: user.name, email: user.email },
      token,
    })
  } catch (err) {
    next(err)
  }
}

// 获取当前用户信息
exports.getProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, name: true, email: true, createdAt: true },
    })
    if (!user) {
      return res.status(404).json({ message: '用户不存在' })
    }
    res.json(user)
  } catch (err) {
    next(err)
  }
}
