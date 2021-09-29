import Fastify from 'fastify'
import app from './app'

const server = Fastify({
  logger: {
    level: 'info',
    prettyPrint: true
  }  
})

server
  .register(app)
  .then(() => server.ready())
  .then(() => server.listen(3000))
// import { app } from './app'

// const server = app({
//   logger: {
//     level: 'info',
//     prettyPrint: true
//   }
// })

// server.listen(3000, (err, address) => {
//   if (err) {
//     console.log(err)
//     process.exit(1)
//   }
// })
