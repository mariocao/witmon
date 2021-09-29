import { FastifyPluginAsync, FastifyRequest } from 'fastify'
import { Egg, ClaimEggParams } from "../types"
import { EggRepository } from "../repositories/egg"
import {
    uniqueNamesGenerator,
    adjectives,
    colors,
    animals,
} from 'unique-names-generator'

const claim: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    //   fastify.get('/', async function (request, reply) {
    //     return "Not yey implemented! :)"
    //   })

    if (!fastify.mongo.db) throw Error('mongo db not found')
    const repository = new EggRepository(fastify.mongo.db)

    fastify.post<{ Body: ClaimEggParams; Reply: Egg | Error }>('/claim', {
        schema: {
            body: ClaimEggParams,
            response: {
                200: Egg
            }
        },
        handler: async (request: FastifyRequest<{ Body: ClaimEggParams }>, reply) => {

            const key = request.body.key
            const egg = await repository.get(key)

            if (!egg) {
                return reply
                    .status(400)
                    .send(new Error(`Egg does not exist (key: ${key})`))
            }

            if (egg.token) {
                return reply
                    .status(400)
                    .send(new Error(`Egg has already been claimed (key ${key})`))
            }

            const token = fastify.jwt.sign({ id: key })
            // TODO: change me!
            const username = uniqueNamesGenerator({
                dictionaries: [adjectives, colors, animals],
                length: 2,
                separator: '-',
            })

            try {
                return await repository.update({
                    ...egg,
                    token,
                    username
                })
            } catch (error) {
                reply.status(409).send(error as Error)
            }
        }
    })

}

export default claim

// import { FastifyRequest } from "fastify"
// import { EggRepository } from "../repositories/egg"
// import { ListEggsQueryString, GetByKeyParams, EggInput, Egg } from "../types"

// export function routePlugin(fastify: any, options: any, next: any) {

//   fastify.register((fastify, options, next) => {
//     if (!fastify.mongo.db) throw Error('mongo db not found')
//     const repository = new EggRepository(fastify.mongo.db)

//     fastify.get<{ Querystring: ListEggsQueryString }>('/eggs', {
//       schema: {
//         querystring: ListEggsQueryString
//       },
//       handler: async (
//         request: FastifyRequest<{ Querystring: ListEggsQueryString }>
//       ) => {
//         const { keys } = request.query

//         return repository.list(keys)
//       }
//     })

//     fastify.get<{ Params: GetByKeyParams }>('/eggs/:key', {
//       schema: {
//         params: GetByKeyParams
//       },
//       handler: async (request: FastifyRequest<{ Params: { key: string } }>) => {
//         const { key } = request.params

//         // const token = fastify.jwt.sign({ id: key })
//         // console.log("Token:", token)

//         // console.log("Decoded: ", fastify.jwt.verify(token))
//         // console.log("Decoded wrong: ", fastify.jwt.verify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJpYXQiOjE2MzI4MzU3NjN9.jRQqyJssy9w7cWv6rQmIjfntX6t_cVUbSmhIo18cot9"))

//         return await repository.get(key)
//       }
//     })

//     fastify.post<{ Body: EggInput; Reply: Egg | Error }>('/eggs', {
//       schema: {
//         body: EggInput,
//         response: {
//           200: Egg
//         }
//       },
//       handler: async (request: FastifyRequest<{ Body: EggInput }>, reply) => {
//         const egg: Egg = {
//           ...request.body,
//           score: 0,
//           improvedBy: [],
//           lastTimeImproved: 0
//         }
//         try {
//           return await repository.create(egg)
//         } catch (error) {
//           reply.status(409).send(error as Error)
//         }
//       }
//     })

//     // fastify.post<{ Body: ImproveInput; Reply: Egg | Error }>('/eggs/improve', {
//     //   schema: {
//     //     body: ImproveInput,
//     //     response: {
//     //       200: Egg
//     //     }
//     //   },
//     //   handler: async (
//     //     request: FastifyRequest<{ Body: ImproveInput }>,
//     //     reply
//     //   ) => {
//     //     const incubated = await repository.get(request.body.incubated)
//     //     const incubator = await repository.get(request.body.incubator)

//     //     if (!incubated) {
//     //       return reply
//     //         .status(400)
//     //         .send(
//     //           new Error(
//     //             `Wrong incubated egg with key ${request.body.incubated}`
//     //           )
//     //         )
//     //     }

//     //     if (!incubator) {
//     //       return reply
//     //         .status(400)
//     //         .send(
//     //           new Error(
//     //             `Wrong incubator egg with key ${request.body.incubator}`
//     //           )
//     //         )
//     //     }

//     //     // Check if incubated is being incubated right now
//     //     if (Date.now() < incubated.lastTimeImproved + IMPROVE_PERIOD) {
//     //       const lastImprovedByIncubator = incubated.improvedBy
//     //         .filter(egg => egg.key === incubator.key)
//     //         .sort((egg1, egg2) => {
//     //           return egg2.timestamp - egg1.timestamp
//     //         })[0]

//     //       if (
//     //         !lastImprovedByIncubator ||
//     //         Date.now() < lastImprovedByIncubator.timestamp + DELAY_TO_IMPROVE
//     //       ) {
//     //         repository.improve(incubated.key, incubator.key)
//     //       } else {
//     //         return reply
//     //           .status(401)
//     //           .send(
//     //             new Error(
//     //               `Egg ${incubated.key} has to wait to incubate this egg again`
//     //             )
//     //           )
//     //       }
//     //     } else {
//     //       return reply
//     //         .status(401)
//     //         .send(
//     //           new Error(`Egg ${incubated.key} is being incubated right now`)
//     //         )
//     //     }
//     //   }
//     // })

//     next()
//   })
// }
