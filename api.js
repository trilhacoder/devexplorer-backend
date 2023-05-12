let express = require("express")
let cors = require('cors')
let pgp = require("pg-promise")

let app = express()

app.use(cors())
app.use(express.json())

let bd = pgp()(process.env.DATABASE_URL)

app.get("/tarefas", async function(req, res) {
    let tarefas = await bd.query("select * from tarefas")
    res.json(tarefas)
})

app.post("/tarefas", async function(req, res) {
    await bd.query('insert into tarefas (titulo, concluida) values ($1, $2)', [ req.body.titulo, req.body.concluida ])
    res.end()
})

app.delete("/tarefas/:id", async function(req, res) {
    await bd.query('delete from tarefas where id = $1', [ req.params.id ])
    res.end()
})

app.put("/tarefas/:id", async function(req, res) {
    await bd.query('update tarefas set titulo = $1, concluida = $2 where id = $3', [ req.body.titulo, req.body.concluida, req.params.id ])
    res.end()
})

app.listen(process.env.PORT || 3000, function() {
    console.log("API REST executando na porta 3000 ...")
})