import express from 'express'; // importe application express
import Database from './models/DataBase.js'; 

const app = express();
app.use(express.urlencoded({ extended: true }));

app.get("/", async function (req, res) {
    const wishlist = await Database.loadMany({Achete : 0});
    const ownedlist = await Database.loadMany({Achete : 1, Fonctionnel :1});
    const brokenlist = await Database.loadMany({Achete : 1, Fonctionnel : 0});
    let total = 0;
    const totalbought = await Database.loadMany({Achete:1})
    for(let elem of totalbought){  
        total += elem.Prix 
    }
    res.render('listTasks.ejs', { wishlist, ownedlist, brokenlist, total});
  });

app.post("/add", async function (req, res) {
  const newcolonne = new Database();
  newcolonne.Marque = req.body.Marque
  newcolonne.Prix = req.body.Prix
  newcolonne.Taille = req.body.Taille
  newcolonne.Achete = 0
  newcolonne.Fonctionnel = 1
  await newcolonne.save();
  res.redirect('/');
});

app.get("/delete/:id", async function (req, res) {
  await Database.delete({ idtv: req.params.id });
  res.redirect('/');
});

app.get("/bought/:id", async function (req, res) {
    const tv = await Database.load({ idtv: req.params.id });
    tv.Achete = 1;
    await tv.save();
    res.redirect('/');
  });

  //diriger sur autre page
app.get("/break/:id", async function (req,res){
    const tv = await Database.load({ idtv: req.params.id });
    tv.Fonctionnel = 0;
    await tv.save();
    res.render('break.ejs', {tv})
})

//reviens a la page de base 
app.post("/addcause/:id", async function(req,res){
    const tv = await Database.load({idtv : req.params.id})
    tv.Fonctionnel = 0
    tv.Cause = req.body.Broken ? req.body.Broken : null;
    await tv.save()
    res.redirect('/')
})

app.use(express.static('public'))

// get pour un lien 
// post pour un bouton
app.listen(4000);