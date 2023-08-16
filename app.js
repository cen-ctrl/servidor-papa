const express = require("express");
const path = require("path");

const app = express();

const AYUNTAMIENTOS = [
  "madrid",
  "barcelona",
  "valencia",
  "alicante",
  "acoruna",
  "bilbao",
  "cordoba",
  "elche",
  "gijon",
  "granada",
  "lhospitalet",
  "malaga",
  "murcia",
  "palmademallorca",
  "sevilla",
  "valencia",
  "valladolid",
  "vigo",
  "vitoria",
  "laspalmasdegrancanaria",
];

app.get("/", (req, res) => {
  HTMLtext = `<h1>Normativas de separación de residuos por Ayuntamientos</h1>
   <h4>Guías</h4>
   <ul>`;
  AYUNTAMIENTOS.forEach((elem) => {
    HTMLtext += `\n<li><a href="/guias/guia-residuos-${elem}">${elem}</a></li>`;
  });
  HTMLtext += `</ul>\n<h4>Ordenanzas</h4>
  <ul>`;
  AYUNTAMIENTOS.forEach((elem) => {
    HTMLtext += `\n<li><a href="/ordenanzas/ordenanza-residuos-${elem}">${elem}</a></li>`;
  });
  HTMLtext += `</ul>`;
  res.status(200).send(HTMLtext);
});

app.get("/:tipo/:ayuntamiento", (req, res) => {
  const { tipo, ayuntamiento } = req.params;
  console.log(tipo);
  console.log(ayuntamiento);
  res
    .status(200)
    .sendFile(
      path.resolve(__dirname, `./pdf-files/${tipo}/${ayuntamiento}.pdf`)
    );
});

app.all("*", (req, res) => {
  res.status(404).send("Resource not found");
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running...`);
});
