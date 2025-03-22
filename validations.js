import { body } from "express-validator";

export const registerValidation = [
    body("login", "Incorrect Login! Minimum length 3 characters!").isLength({
        min: 3,
    }),
    body(
        "password",
        "Incorrect Password! Minimum length 5 characters!"
    ).isLength({
        min: 5,
    }),
];

export const loginValidation = [
    body("login", "Incorrect Login! Minimum length 3 characters!").isLength({
        min: 3,
    }),
    body(
        "password",
        "Incorrect Password! Minimum length 5 characters!"
    ).isLength({
        min: 5,
    }),
];

export const productCreateValidation = [
    body("title", "Invalid product name. Minimum length: 3 characters.")
        .isString()
        .isLength({ min: 3 }),
    body("composition", "Invalid product composition.").optional().isString(),
    body("gift", "Invalid gift composition.").optional().isString(),
    body("price", "Invalid product price. Must be a number.").isNumeric(),
    body("salePrice")
        .optional()
        .custom((value) => value === null || !isNaN(parseFloat(value)))
        .withMessage("Invalid product sale price. Must be a number or null."),

    body("isNewProduct", "Invalid new product. Must be a boolean.").isBoolean(),
    body("weight", "Invalid product weight. Must be a number.")
        .optional()
        .isNumeric(),
    body("rating", "Invalid product rating. Must be a number.").isNumeric(),
    body("category", "Invalid product category.").isString(),
    body("imageUrl", "Invalid product image. Must be a valid URL.")
        .isString()
        .isURL(),
];

export const orderCreateValidation = [
    body("firstName", "Invalid first name. Minimum length: 3 characters.")
        .isString()
        .isLength({ min: 3 }),
    body("lastName", "Invalid last name. Minimum length: 3 characters.")
        .isString()
        .isLength({ min: 3 }),
    body("phone", "Invalid phone. Minimum length: 3 characters.")
        .isString()
        .isLength({ min: 10 }),
    body("orderItems", "Invalid order item").isArray(),
    body("delivery", "Invalid delivery").isString().notEmpty(),
    body("comment", "Invalid comment").optional().isString(),
    body("totalPrice", "Invalid total price. Must be a number.").isNumeric(),
    body("status", "Invalid product weight. Must be a number.").isString(),
];
