import { Database } from './database.js'
import { randomUUID } from 'node:crypto'
import { buildRoutePath } from './utils/build-route-path.js'


const database = new Database()

export const routes = [
    {
        method: 'GET',
        url: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { search } = req.query

            const tasks = database.select('tasks', {
                title: search,
                description: search,
            })

            return res.end(JSON.stringify(tasks))
        }
    },
    {
        method: 'POST',
        url: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { title, description, } = req.body

            if (!title) {
                return res.writeHead(400).end(JSON.stringify({ message: 'Title is required' }),
                )
            }

            if (!description) {
                return res.writeHead(400).end(JSON.stringify({ message: 'Description is required' }),
                )
            }


            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: new Date().toLocaleString(),
                update_at: new Date().toLocaleString(),
            }

            database.insert('tasks', task)

            return res.writeHead(201).end()
        }
    },
    {
        method: 'PUT',
        url: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {

            const { id } = req.params
            const { title, description, } = req.body

            if (!title && !description) {
                return res.writeHead(400).end(
                    JSON.stringify({ message: 'Description is required' })
                )
            }

            const [task] = database.select('tasks', { id })

            if (!task){
                return res.writeHead(404).end()
            }

            database.update('tasks', id, {
                title: title ?? task.title,
                description: description ?? task.description,
                updated_at: new Date().toLocaleString(),
            })

            return res.writeHead(204).end()
        }
    },
    {
        method: 'DELETE',
        url: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {

            const { id } = req.params

            database.delete('tasks', id)

            return res.writeHead(204).end()
        }
    }
]