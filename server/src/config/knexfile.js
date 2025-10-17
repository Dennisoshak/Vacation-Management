import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const config = {
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

export default config
