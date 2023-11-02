import express from 'express'
import routerProducts from './routes/products.router.js'
import routerCarts from './routes/carts.router.js'
import __dirname from './utils.js'
import routerViews from './routes/views.router.js'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'


const app = express()

app.use(express.json())
app.use('/static', express.static(__dirname + '/public'))

app.engine('handlebars', handlebars.engine())
app.set('views',__dirname + '/views')
app.set('view engine', 'handlebars')

app.use('/api/products', routerProducts)
app.use('/api/carts', routerCarts)
app.use('/home', routerViews)

const http = app.listen(8080, () => console.log(`servidor is running`))

export const socketServer = new Server(http)

socketServer.on('connection', socket => {
    console.log('connected client')
})