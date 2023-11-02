import fs from 'fs'

 class ProductManager {
    constructor (path){
        this.path = path
        this.products = []
    }

    validateCode = async (code) => {
        try{ 
            const data = await fs.promises.readFile(this.path, 'utf-8')
            this.products = JSON.parse(data)

            return this.products.some((producto) => producto.code == code)
        } catch (err) {
            return err
        }

    }

    getProducts =  async (limit) => {
        try{
            if(!fs.existsSync(this.path)) return this.products

            const data = await fs.promises.readFile(this.path, 'utf-8')
            this.products = JSON.parse(data)
            const productosFiltrados = limit ? this.products.slice(0,limit) : this.products
            return productosFiltrados

        } catch (err) {
            return err
        }
    }

    getAddProducts = async (producto) => {
        try {
            if (!fs.existsSync(this.path)) {
                this.products = [];
            } else {
                const data = await fs.promises.readFile(this.path, 'utf-8');
                this.products = JSON.parse(data);
            }
    
            if (!producto.title || !producto.description || !producto.price || !producto.thumbnail || !producto.code || !producto.stock) {
                return "mandatory data is missing";
            }
    
            const validacion = await this.validateCode(producto.code);
            if (validacion) {
                return "the product already exists";
            }
    
            const product = {
                id: this.products.length + 1,
                title: producto.title,
                description: producto.description,
                price: producto.price,
                thumbnail: producto.thumbnail,
                code: producto.code,
                stock: producto.stock
            };
    
            this.products.push(product);
    
            await fs.promises.writeFile(this.path, JSON.stringify(this.products));
            return {
                status: "the product was created correctly",
                res: product
            };
        } catch (err) {
            return err;
        }
    }

    getProductById = async (id) => {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            this.products = JSON.parse(data);
            const producto = this.products.find(product => product.id === id);
    
            if (producto) {
                return producto;
            } else {
                throw new Error('Product Not Found');
            }
        } catch (err) {
            return err;
        }
    }

    updateProduct = async (id, update) => {
        try {
            if (Object.keys(update).length === 0) {
                throw new Error('no updated data was sent');
            }
    
            const data = await fs.promises.readFile(this.path, 'utf-8');
            this.products = JSON.parse(data);
            const producto = this.products.find(product => product.id === id);
    
            if (!producto) {
                throw new Error('Product Not Found');
            }
    
            for (let propiedad in update) {
                if (producto.hasOwnProperty(propiedad)) {
                    producto[propiedad] = update[propiedad];
                }
            }
    
            await fs.promises.writeFile(this.path, JSON.stringify(this.products));
            return "the product was modified correctly";
        } catch (err) {
            return err;
        }
    }
    
    deleteProduct = async (id) => {
        try{
            const data = await fs.promises.readFile(this.path, 'utf-8')
            this.products = JSON.parse(data)
            const productos = this.products.filter(product => product.id !== id)

            await fs.promises.writeFile(this.path, JSON.stringify(productos))
            return {status:"The product was disposed of correctly.", res: productos}
        } catch (err) {
            return err
        }
    }
}

export default ProductManager