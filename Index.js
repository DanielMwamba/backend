const express = require("express");
const PORT = 3002;
const app = express();

const data = require("./data.json");

app.use(express.json());

function findArticleById(id) {
  return data.find((article) => article.id === +id);
}

function findArticleIndex(id) {
  return data.findIndex((article) => article.id === +id);
}

app.get("/", (req, res) => {
  console.log("L'application fonctionne");
  res.send("L'application fonctionne");
});

//PAGINATION

app.get("/articles", (req, res) => {
    const page = req.query.page || 1;
    const pageSize = 11;
    const starIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;
    const pageArticles = data.slice(starIndex, endIndex);

    if (page <= 20) {
      return res.json({
        currentpage: page,
        perPage: pageSize,
        totalItems: data.length,
        totalPages: Math.ceil(data.length / pageSize),
        articles: pageArticles
    
      });
    } else {
      res.status(404).send("Cette page n'existe pas")
    }   
 
});


// MODIFIER PARTIELLEMENT UN ARTICLE

app.patch("/articles/:id", (req, res) =>{
  const {id} = req.params;
  const updateArticle = req.body;
  const articleIndex = findArticleIndex(id);
  if (articleIndex!==0) {
    Object.assign(data[articleIndex], updateArticle);
    res.send(data[articleIndex])
  } else {
    res.status(404).send(`L'article avec l'ID ${id} n'existe pas`)
  }
});


// SUPPRIMER PLUSIERS ARTICLES


app.delete("/articles", (req, res) =>{
  const elementsToDelete = req.body.select;
  const deleteArticles = [];
  elementsToDelete.forEach(id => {
    const articleIndex = findArticleIndex(id);
    if (articleIndex !== -1) {
      deleteArticles.push(data.splice(articleIndex, 1)[0]);
      res.status(202).send(deleteArticles);
    }
  });

})

//TROUVER UN ARTICLE PAR SON ID

app.get("/articles/:id", (req, res) => {
  const { id } = req.params;
  const article = findArticleById(id);
  if (article) {
    return res.send(article);
  }

  res.status(404).send(`L'article avec l'id : ${id} n'existe pas`);
});


// AJOUTER UN ARTICLE

app.post("/articles", (req, res) => {
  const newArticle = req.body;

  data.push(newArticle);

  res.status(201).send(data[data.length - 1]);
});


// MODIFIER UN ARTICLE


app.put("/articles/:id", (req, res) => {
  const article = req.body;
  const { id } = req.params;
  const articleIndex = findArticleIndex(id);
  if (articleIndex < 0) {
    data.push(article);
    return res.status(201).send(data[data.length - 1]);
  } else {
    data[articleIndex] = article;
    return res.status(200).send(data[articleIndex]);
  }
});


// SUPPRIMER UN ARTICLE PAR SON ID

app.delete("/articles/:id", (req, res) => {
  const { id } = req.params;
  const articleIndex = findArticleIndex(id);
  const article = findArticleById(id);
  if (articleIndex < 0) {
    res.status(404).send(`L'article avec l'id ${id} n'existe pas`);
  } else {
    data.splice(articleIndex, 1);
    res.status(202).send(article); 
  }
});

// LANCER LE SERVEUR

app.listen(PORT, () => {
  console.log(`Le serveur écoute sur le port ${PORT}`);
});