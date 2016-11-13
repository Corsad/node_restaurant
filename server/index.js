let fs = require('fs');
let express = require('express');
let path = require('path')
let morgan = require('morgan')
let cookieParser = require('cookie-parser')
let bodyParser = require('body-parser')
let session = require('express-session')
let MongoStore = require('connect-mongo')(session)
let mongoose = require('mongoose')
let requireDir = require('require-dir')

let app = express();
let config = requireDir(path.join(__dirname, 'configs'), {recurse: true})
let port = process.env.PORT || 3000
const NODE_ENV = process.env.NODE_ENV

mongoose.connect(config.database[NODE_ENV].url)

app.use(morgan('dev'))
app.use(cookieParser('restaurantnode'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// set view engine
app.set('views', path.join(__dirname, 'public', 'containers'))
app.set('view engine', 'ejs')

// test with express-react-views
// have to use jsx as view, but I want to load template first then render a React class inside
// app.engine('jsx', require('express-react-views').createEngine());

// set static folder
app.use(express.static(path.join(__dirname, 'public')))

new Promise((resolve, reject) => {
    fs.readdir(path.join(__dirname,'modules'), (err, files) => {
        if(err) return reject(err);

        resolve(files);
    })
})
.then(fileList => {
    fileList.map(filename => {
        var mountPoint = filename.split('.').shift();
        var imported = require(`./modules/${mountPoint}`)();
        app.use(`/${mountPoint}/`, imported.routes);
    });
})
.then(() => {

    // set index
    app.get('/', (req,res) => {
        res.render('index.ejs')
    })

    // listen to port
    app.listen(port, () =>{
        console.log(`Listen to port: ${port}`)
    });
});
