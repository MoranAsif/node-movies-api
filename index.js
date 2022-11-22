
const app = require('express')();

const port = 8080;
const fs = require('fs');

function read_movies_file(){
    return JSON.parse(fs.readFileSync('movies.json', 'utf8'))
}

//middleware to generate IDs
const id_generator = function (req, res, next) {
    req.query.id = Math.floor(Math.random() * 1000) //number between 0-1000
    next()
}

app.use(id_generator)


app.listen(port, function (err) {
    if(err){
        console.log("error while starting server");
    }
    else{
        console.log(`hi from port http://127.0.0.1:${port}`);
    }
})

app.get('/get-all-movies', (req,res) => {
    let movies = read_movies_file()
    res.status(200).send(movies)}
);


app.get('/get-movie', (req,res) => {
    let movies = read_movies_file()
    const movie_id = parseInt(req.query.id)
    let return_movie = movies.find(movie => movie.id === movie_id);
    if (return_movie != null) {
        res.status(200).send(return_movie)}
    else{
        res.status(200).send(`There is no movie with id ${movie_id}`)}
});


app.delete('/delete-movie', (req,res) => {
    let movies = read_movies_file()
    const movie_id = parseInt(req.query.id)
    var movies_filtered = movies.filter(function(el) { return el.id !== movie_id})
    fs.writeFileSync('movies.json', JSON.stringify(movies_filtered))

    if ((movies.length - movies_filtered.length) === 1) {
        res.status(200).send(`Movie ${movie_id} was deleted`)}
    else{
        res.status(200).send(`There is no movie with id ${movie_id}`)}
});


app.post('/add-movie', (req,res) => {
    let new_movie = {
        "id": req.query.id,
        "name": req.query.name,
        "year": req.query.year,
        "ranking": 9.1,
        "bestseller": true
    };
    var movies = read_movies_file()
    movies.push(new_movie)
    fs.writeFileSync('movies.json', JSON.stringify(movies))
    res.status(200).send(`Movie ${name} was added`)
})


app.use((req, res, next) => {
    res.status(404).json({
        message: `Endpoint ${req.url} does not exit`
    })
})
