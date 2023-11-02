import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";


const router = Router()
const productManager = new ProductManager()

router.get('/', async (req, res) => {
    try{
        const limit = parseInt(req.query?.limit)
        const products = await productManager.getProducts(limit)
        res.render('home',{
            style: 'style.css',
            products
        })

    } catch (err) {
        res.status(500).send("An error occurred while obtaining the products" + err)
    }  
})

router.get('/realtimeproducts', async (req, res) => {
    try{
        const limit = parseInt(req.query?.limit)
        const products = await productManager.getProducts(limit)
        res.render('realTimeProducts',{
            style: 'style.css',
            products
        })
    } catch (err) {
        res.status(500).send("An error occurred while obtaining the products" + err)
    }  
})


export default router