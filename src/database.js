const mongoose = require('mongoose');

//funciones para conectar la bd
mongoose.connect('mongodb://localhost/notes-db-app',{
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false
})
    .then(db=>console.log('DB is connect'))
    .catch(db=>console.log('Error to connect in db'));