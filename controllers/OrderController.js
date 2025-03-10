import nodemailer from "nodemailer";
import dotenv from 'dotenv';

import OrderModel from "../models/Order.js";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false // Отключение проверки самоподписанных сертификатов
    }
});

export const getAllOrders = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const pageNumber = parseInt(page, 10) || 1;
        const limitNumber = parseInt(limit, 10) || 10;

        const skip = (pageNumber - 1) * limitNumber;

        const filter = {};
        if (status) {
            filter.status = status;
        }

        const orders = await OrderModel.find(filter)
            .skip(skip)
            .limit(limitNumber);

        const totalCount = await OrderModel.countDocuments(filter);

        res.json({
            orders,
            totalPages: Math.ceil(totalCount / limitNumber),
            currentPage: pageNumber,
            totalItems: totalCount,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Не удалось получить список заказов",
        });
    }
};

export const getOneOrder = async (req, res) => {
    try {
        const orderId = req.params.id;

        const order = await OrderModel.findOne({ orderId });

        if (!order) {
            return res.status(404).json({
                message: "Order not found!",
            });
        }

        res.json(order);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Не удалось найти заказ!",
        });
    }
};

export const removeOrder = async (req, res) => {
    try {
        const orderId = req.params.id;

        const order = await OrderModel.findOneAndDelete({ orderId });

        if (!order) {
            return res.status(404).json({
                message: "Order not found!",
            });
        }

        res.json({
            success: true,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Не удалось удалить заказ!",
        });
    }
};

export const updateOrder = async (req, res) => {
    try {
        const orderId = req.params.id;

        const order = await OrderModel.findOneAndUpdate(
            { orderId },
            {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                phone: req.body.phone,
                delivery: req.body.delivery,
                comment: req.body.comment,
                orderItems: req.body.orderItems,
                totalPrice: req.body.totalPrice,
                status: req.body.status,
            },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({
                message: "Order not found!",
            });
        }

        res.json({
            success: true,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Не удалось найти заказ",
        });
    }
};



export const createOrder = async (req, res) => {
    try {
        const doc = new OrderModel({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            comment: req.body.comment,
            delivery: req.body.delivery,
            phone: req.body.phone,
            orderItems: req.body.orderItems,
            totalPrice: req.body.totalPrice,
            status: req.body.status,
        });

        const order = await doc.save();

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL,
            subject: "🛒 Нове замовлення!",
            html: `
                <h2>📦 Замовлення №${order.orderId}</h2>
                <p><strong>Покупець:</strong> ${req.body.firstName} ${req.body.lastName}</p>
                <p><strong>Сума замовлення:</strong> ${req.body.totalPrice} ₴</p>
                <p><strong>Товари:</strong></p>
                <ul>
                    ${req.body.orderItems
                        .map((item) => `<li>${item.title} - ${item.count} шт</li>`)
                        .join("")}
                </ul>
            `,
        });

        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Не вдалося створити замовлення",
        });
    }
};
