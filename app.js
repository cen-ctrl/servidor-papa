const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const readDocumentos = () => {
  return JSON.parse(fs.readFileSync("./documentos.json", "utf-8"));
};

const app = express();
const storage = multer.diskStorage({
  destination: __dirname + "/files",
  filename: (req, file, cb) =>
    cb(
      null,
      file.originalname.slice(0, file.originalname.length - 4) +
        "-" +
        Math.round(Math.random() * 1e9) +
        ".pdf"
    ),
});
const uploads = multer({
  storage: storage,
});

app.use(express.static("./public"));

app.get("/documentos", (req, res) => {
  const documentos = readDocumentos();
  res.status(200).json(documentos);
});

app.post("/documentos", uploads.single("archivo"), (req, res) => {
  fs.readFile("./documentos.json", (err, documentosString) => {
    if (err) {
      console.log(err);
      return;
    }
    let documentos = JSON.parse(documentosString);

    console.log(req.body);
    console.log(req.file);
    let newId = 1;
    if (documentos.length) newId = documentos[documentos.length - 1].id + 1;
    let newDocumento = {
      id: newId,
      tipo: req.body.tipo,
      ayuntamiento: req.body.ayuntamiento,
      archivo: path.resolve(req.file.destination, req.file.filename),
    };
    documentos.push(newDocumento);
    fs.writeFile("./documentos.json", JSON.stringify(documentos), (err) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log("Database overwritten succesfully...");
      res.status(200).json({ request: "received", fileID: newId });
    });
  });
});

app.delete("/documentos/:id", (req, res) => {
  fs.readFile("./documentos.json", (err, documentosString) => {
    if (err) {
      console.log(err);
      return;
    }
    let documentos = JSON.parse(documentosString);

    const index = documentos.findIndex(
      (x) => Number(x.id) === Number(req.params.id)
    );
    if (index === -1) {
      res.status(404).json({ status: "element not found" });
      return;
    }
    const removedElement = documentos.splice(index, 1);
    console.log(removedElement);

    fs.writeFile("./documentos.json", JSON.stringify(documentos), (err) => {
      if (err) {
        res.status(500).json({ status: "error", error: err });
        return;
      }
      console.log("Database overwritten succesfully...");
      res.status(200).json({ status: "suceeded" });
    });
  });
});

app.get("/documentos/:id", (req, res) => {
  const documentos = readDocumentos();
  const el = documentos.find((x) => x.id == req.params.id);
  if (el === undefined)
    res.status(404).send("El archivo que buscas no ha sido encontrado.");
  res.status(200).sendFile(el.archivo);
});

app.get("/documentos/tipo/:tipo", (req, res) => {
  const documentos = readDocumentos();
  res.status(200).json(documentos.filter((x) => x.tipo == req.params.tipo));
});

app.all("*", (req, res) => {
  res.status(404).send("Resource not found");
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running...`);
});
