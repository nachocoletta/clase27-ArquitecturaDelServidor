import { Router } from "express";
import CartManager from "../../dao/CartManager.js";
import CartController from "../../controllers/cart.controller.js"

const router = Router();

router.get('/', async (req, res) => {
    const carts = await CartController.get();
    res.status(200).json(carts);
});

router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await CartController.getById(cid);
        res.status(200).json(cart)
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message })
    }
})

router.post('/', async (req, res) => {
    try {
        const cart = await CartController.create();
        res.status(201).json(cart);
    } catch (error) {
        console.error("Error al crear el carrito", error)
        res.status(error.statusCode || 500).json({ message: error.message })
    }
});

router.post('/:cartId', async (req, res) => {
    try {
        const { cartId } = req.params
        const { productId, quantity } = req.body;
        const product = await CartController.addProductToCart(cartId, productId, quantity)
        res.status(201).json(product)
    } catch (error) {
        console.error(error.message)
        res.status(error.statusCode || 500).json({ message: error.message })
    }
})

// router.delete('/:cartId', async (req, res) => {
//     const { cartId } = req.params;

//     try {
//         await CartManager.deleteById(cartId);
//         res.status(204).end();
//     } catch (error) {
//         res.status(error.statusCode || 500).json({ message: error.message })
//     }
// })

router.delete('/:cid/products/:pid', async (req, res, next) => {
    const { cid, pid } = req.params

    // console.log('entra a la ruta')
    try {
        const cart = await CartController.removeProductFromCart(cid, pid)
        res.status(200).send(cart)
    } catch (error) {
        next(error)
        // res.status(error.statusCode || 500).json({ message: error.message })
    }
})

router.delete('/:cid', async (req, res) => {
    const { cid } = req.params;
    // console.log('entra');
    try {
        const cart = await CartController.removeAllProductsFromCart(cid)
        res.status(201).send(cart)
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message })
    }
})

router.put('/:cid', async (req, res) => {
    const { cid } = req.params;
    const products = req.body;
    // console.log("products", products);
    try {
        const cart = await CartController.updateProductsFromCart(cid, products)
        res.status(201).send(cart)
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message })
    }
})

router.put('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        const cart = await CartManager.updateProductQuantityFromCart(cid, pid, quantity)
        res.status(200).send(cart)
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message })
    }

})
export default router;