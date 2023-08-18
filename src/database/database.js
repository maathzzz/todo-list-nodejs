import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database { 
    #database = {}

    constructor() {
        fs.readFile(databasePath, 'utf8')
        .then(data => {
            this.#database = JSON.parse(data)
        })
        .catch(() => {
            this.#persist()
        })
    }

    #persist() {
        fs.writeFile(databasePath, JSON.stringify(this.#database))
    }

    select(table, search) {
        let data = this.#database[table] ?? []

        if (search) {
            data = data.filter(row => {
                return Object.entries(search).some(([key, value]) => {
                    return row[key].toLowerCase().includes(value.toLowerCase())
                })
            })
        }

        console.log(this.#database[table])
        return data
    }

    insert(table, data) {
        if(Array.isArray(this.#database[table])) {
            this.#database[table].push(data)
        } else {
            this.#database[table] = [data]
        }

        this.#persist();

        return data;
    }

    delete(table, id) {
        const rowIndex = this.#database[table].findIndex(row => row.id === id)

        if (rowIndex > -1) {
            this.#database[table].splice(rowIndex, 1)
            this.#persist()
        }
    }

    update(table, id, data) {
        const registerToUpdate = this.#database[table].find(register => register.id === id)
        const updateKeys =  Object.keys(data)

        updateKeys.forEach(key => {
            registerToUpdate[key] = data[key]
            this.#persist()
        })
    }
}