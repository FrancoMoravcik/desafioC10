const socket = io()

const productForm = document.getElementById('form')
const title = document.getElementById('title')
const description = document.getElementById('description')
const price = document.getElementById('price')
const thumbnail = document.getElementById('thumbnailInput')
const stock = document.getElementById('stock')
const code = document.getElementById('code')
const products = document.getElementById('productList')
const deleteButton = document.querySelectorAll('#btnDelete')

productForm.addEventListener('submit', async e => {
    try {
        e.preventDefault()
        const data = new FormData(form)

        await fetch('/api/products', {
            method: 'POST',
            body: data
        }).then(result => result.json())
            .then(product => {
                title.value = ''
                description.value = ''
                price.value = ''
                thumbnail.value = null
                stock.value = ''
                code.value = ''
            })
    } catch (error) {
        console.log(error)
    }

})

const deleteProduct = async (id) => {
    try {
        await fetch(`/api/products/${id}`, {
            method: 'DELETE'
        }).then(res => res.json()).then(json => console.log(json))
    } catch (error) {
        console.log(error)
    }
}

const createHtml = (data) => {

    if (data) {
        return data.length ?
            data.map(newProduct => {
                products.innerHTML += `
            <div id="products">
                <a href="#">
                    <img src="${newProduct.thumbnail}" alt="" />
                </a>
                <div>
                    <a href="#">
                        <h5>${newProduct.title}</h5>
                    </a>
                    <p>${newProduct.description}</p>
                    <p><b>stock:</b> ${newProduct.stock}</p>
                    <p><b>price: $</b>${newProduct.price}</p>
                    <div>
                        <button href="#" id="btnDelete" onclick="deleteProduct(${newProduct.id})">Delete</button>
                    </div>
                </div>
            <div>
            `
            })

            : products.innerHTML += `
            <div id="products">
                <a href="#">
                    <img src="${data.thumbnail}" alt="" />
                </a>
                <div class="p-5">
                    <a href="#">
                        <h5>${data.title}</h5>
                    </a>
                    <p>${data.description}</p>
                    <p><b>stock:</b> ${data.stock}</p>
                    <p><b>price: $</b>${data.price}</p>
                    <div>
                    <button href="#" id="btnDelete" onclick="deleteProduct(${data.id})" Delete</button>
                        </div>
                </div>
            <div>
        `
    } else if (data == null) {
        return '<h2>there are no products</h2>'
    }
}

socket.on('newProduct', (data) => {
    products.innerHTML = ""
    createHtml(data)
})

socket.on('deleteProduct', (data) => {
    products.innerHTML = ""
    createHtml(data)
})