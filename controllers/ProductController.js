import ProductModel from "./../models/Product.js";
import CategoryModel from "./../models/Category.js";


export const getAllProducts = async (req, res) => {
    try {
        const { sort, category, page = 1, limit = 10 } = req.query;

        const pageNumber = parseInt(page, 10) || 1;
        const limitNumber = parseInt(limit, 10) || 10;
        const skip = (pageNumber - 1) * limitNumber;

        const filter = {};

        if (category) {
            filter.category = category; 
        }

        const sortFields = sort ? sort.split(',') : [];
        const sortObject = sortFields.reduce((acc, field) => {
            let order = 1;
            if (field.startsWith('-')) {
                order = -1;
                field = field.substring(1);
            }

            if (['price', 'title', 'rating'].includes(field)) {
                acc[field] = order;
            }
            return acc;
        }, {});

        const products = await ProductModel.find(filter)
            .sort(sortObject)
            .skip(skip)
            .limit(limitNumber);

        const totalCount = await ProductModel.countDocuments(filter);

        res.json({
            products,
            totalPages: Math.ceil(totalCount / limitNumber),
            currentPage: pageNumber,
            totalItems: totalCount,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch products!",
        });
    }
};

export const getOneProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await ProductModel.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found!",
            });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve the product!",
        });
    }
};

export const removeProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const deletedProduct = await ProductModel.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return res.status(404).json({
                message: "Product not found!",
            });
        }

        res.json({
            success: true,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete the product!",
        });
    }
};

export const createProduct = async (req, res) => {
    try {
        const doc = new ProductModel({
            title: req.body.title,
            composition: req.body.composition,
            price: req.body.price,
            salePrice: req.body.salePrice,
            isNewProduct: req.body.isNewProduct,
            weight: req.body.weight,
            category: req.body.category,
            rating: req.body.rating,
            imageUrl: req.body.imageUrl,
            gift: req.body.gift,
        });

        const product = await doc.save();

        res.json(product);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to create the product!",
        });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;

        const updatedProduct = await ProductModel.findByIdAndUpdate(
            productId,
            {
                title: req.body.title,
                composition: req.body.composition,
                price: req.body.price,
                salePrice: req.body.salePrice,
                isNewProduct: req.body.isNewProduct,
                weight: req.body.weight,
                rating: req.body.rating,
                category: req.body.category,
                imageUrl: req.body.imageUrl,
                gift: req.body.gift,
            },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({
                message: "Product not found!",
            });
        }

        res.json({
            success: true,
            message: "Product updated successfully!",
            updatedProduct,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to update the product!",
        });
    }
};
