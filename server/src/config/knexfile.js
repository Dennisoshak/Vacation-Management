import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const config = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: join(__dirname, '../../database.sqlite')
    },
    useNullAsDefault: true,
    migrations: {
      directory: join(__dirname, '../migrations'),
      extension: 'js'
    },
    seeds: {
      directory: join(__dirname, '../seeds'),
      extension: 'js'
    }
  },

  production: {
    client: 'sqlite3',
    connection: {
      filename: join(__dirname, '../../database.sqlite')
    },
    useNullAsDefault: true,
    migrations: {
      directory: join(__dirname, '../migrations'),
      extension: 'js'
    },
    seeds: {
      directory: join(__dirname, '../seeds'),
      extension: 'js'
    }
  }
}

export default config
