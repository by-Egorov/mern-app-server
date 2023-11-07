import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import {validationResult} from 'express-validator'
import UserModel from '../models/User.js'

//Register

export const register = async (req, res) => {
    try {
        //Запрос на валидацию формы
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }
        //Возвращаем пароль
        const password = req.body.password

        //Hash password
        const salt = await bcrypt.genSalt(7)
        const hash = await bcrypt.hash(password, salt)

        //новый _doc пользователя
        const doc = new UserModel({
            email: req.body.email,
            name: req.body.name,
            password: hash
        })
        // Save doc mongodb
        const user = await doc.save()
        //Create token ...
        const token = jwt.sign(
            {
                _id: user._id,
            },
            'secret123',
            {
                expiresIn: '30d'
            }
        )
        const {passwordHash, ...userData} = user._doc
        res.json({
            ...userdata,
            token
        })
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'Ошибка регистрации'
        })
    }
}
//Login
export const login = async (res, req) => {
    try {
        const user = await UserModel.findOne({email: req.body.email})
        if (!user) {
            return res.status(404).json({
                message: 'Не верный логин или пароль'
            })
        }
        //Validation pass
        const isValidPass = await bcrypt.compare(
            req.body.password,
            user._doc.passwordHash
        )
        if (!isValidPass) {
            return res.status(400).json({
                message: 'Не верный логин или пароль'
            })
        }
        const token = jwt.sign(
            {
                _id: user._id,
            },
            'secret123',
            {
                expiresIn: '30d',
            }
        )
        const {passwordHash, ...userData} = user._doc
        res.json({
            ...userData,
            token,
        })
    } catch (e) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось авторизоваться',
        })
    }
}
//Get user
export const getMe = async (req, res) => {
    try {
        //Поиск пользователя по I'd
        const user = await UserModel.findById(req.userId)
        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден',
            })
        }

        const {passwordHash, ...userData} = user._doc

        res.json(userData)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Нет доступа',
        })
    }
}
// Update
export const updateUser = async (req, res) => {
    const {userId} = req.params
    const updatedUserData = req.body
    try {
        //Поиск пользователя по I'd
        const user = await UserModel.findByIdAndUpdate(
            userId,
            updatedUserData,
            {new: true}
        )
        res.json(user)
    } catch (err) {
        console.error('Ошибка при обновлении данных пользователя:', error)
        res.status(500).json({error: 'Ошибка при обновлении данных пользователя'})
    }
}