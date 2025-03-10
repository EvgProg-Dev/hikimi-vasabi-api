import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { validationResult } from "express-validator";
import UserModal from "../models/User.js";

// export const register = async (req, res) => {
//     console.log('req: ', req.body);
//     try {
//         const password = req.body.password;
//         const salt = await bcrypt.genSalt(10);
//         const hash = await bcrypt.hash(password, salt);

//         const doc = new UserModal({
//             login: req.body.login,
//             passwordHash: hash,
//         });

//         const user = await doc.save();

//         const token = jwt.sign(
//             {
//                 _id: user._id,
//             },
//             process.env.JWT_SECRET,
//             { expiresIn: "30d" }
//         );

//         const { passwordHash, ...userData } = user._doc;

//         res.json({
//             ...userData,
//             token,
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             message: "Не удалось зарегистрироваться!",
//         });
//     }
// };

export const login = async (req, res) => {
    try {
        const user = await UserModal.findOne({ login: req.body.login });

        if (!user) {
            return res.status(404).json({
                message: "Пользователь не найден!",
            });
        }

        const isValidPass = await bcrypt.compare(
            req.body.password,
            user._doc.passwordHash
        );

        if (!isValidPass) {
            return res.status(400).json({
                message: "Неверный логин или пароль!",
            });
        }

        const token = jwt.sign(
            {
                _id: user._id,
            },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );

        const { passwordHash, ...userData } = user._doc;

        res.json({
            ...userData,
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Не удалось авторизоваться!",
        });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await UserModal.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                message: "Пользователь не найден!",
            });
        }
        const { passwordHash, ...userData } = user._doc;

        res.json(userData);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Нет доступа!",
        });
    }
};
