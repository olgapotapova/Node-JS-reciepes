require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const axios = require('axios');
const app = express();

var path = require('path');
app.use(express.static('public'));
app.use(express.static(path.join(__dirname + '/public')));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname);
app.use(bodyParser.urlencoded({ extended: true }));

const SECRET = process.env.SECRET;

app.get('/', function (req, res) {
    axios.get('https://api.spoonacular.com/recipes/random/?apiKey=' + SECRET)

        .then(function (response) {
            recipes = response.data.recipes[0];

            let name = recipes.title;

            let ingredients = recipes.extendedIngredients;
            var length = ingredients.length;
            const myArray = [];

            for (i = 0; i < length; i++) {
                let ingredients1 = recipes.extendedIngredients[i].name;
                let ingredients2 = recipes.extendedIngredients[i].amount;
                let ingredients3 = recipes.extendedIngredients[i].unit;

                if (ingredients3 != 0) {
                    myArray.push(" " + ingredients1 + " - " + ingredients2 + " " + ingredients3);
                } else {
                    myArray.push(" " + ingredients2 + " " + ingredients1);
                }
            };

            var regex = /(<([^>]+)>)/ig
                , body1 = recipes.summary
                , summary = body1.replace(regex, "")
                , body2 = recipes.instructions
                , Instructions = body2.replace(regex, "");

            let Image = recipes.image;

            res.render('index', { name: name, myArray: myArray, summary: summary, Instructions: Instructions, Image: Image });
        })
        .catch(function (error) {
            console.log(error);
        });

})


app.listen(process.env.PORT || 3000, function () {
    console.log("Server has started.");
});