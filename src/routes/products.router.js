import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";
import { uploader } from "../utils.js";
import { socketServer } from "../app.js";

const router = Router()
const productManager = new ProductManager()

router.get('/', async (req,res) =>{
    try{
        const limit = parseInt(req.query?.limit)
        const products = await productManager.getProducts(limit)
        res.send(products)

    } catch (err) {
        res.status(500).send("Error obtaining the products" + err)
    }
})

router.get('/:id', async (req,res) => {
    try{
        const id = parseInt(req.params.id)
        const producto = await productManager.getProductById(id)
        res.send(producto)
    } catch (err) {
        res.status(500).send("Error obtaining the product: " + err)
    }
})

router.post('/', uploader.single('thumbnail'), async (req, res) => {
    try{

        if(!req.file){
            res.status(500).send("the image was not uploaded")
        }

        const data = req.body
        const filename = req.file.filename

        data.thumbnail = `http://localhost:8080/static/img/${filename}`

        const producto = await productManager.getAddProducts(data)
        const productos = await productManager.getProducts()
        socketServer.emit('newProduct', productos)
        res.json(producto.res)
    } catch (err) {
        res.status(500).send("error loading product: " + err)
    }

})

router.put('/:id', uploader.single('thumbnail'), async (req, res) => {
    try{
        const id = parseInt(req.params.id)
        const data = req.body

        if(req.file){
            const filename = req.file.filename
            data.thumbnail = `http://localhost:8080/img/${filename}`
        }

        const producto = await productManager.updateProduct(id, data)

        res.send(producto)
    } catch (err) {
        res.status(500).send("Error when trying to upgrade the product: " + err)
    }
})

router.delete('/:id', async (req, res) => {
    try{
        const id = parseInt(req.params.id)

        const productEliminated = await productManager.deleteProduct(id)
        socketServer.emit('deleteProduct', productEliminated.res)
        res.json(productEliminated.res)
    } catch (err) {
        res.status(500).send("Error when trying to delete the product: " + err)
    }
})

export default router