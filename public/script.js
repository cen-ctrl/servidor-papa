const guias = document.querySelector("#lista-guia");
const ordenanzas = document.querySelector("#ordenanza-guia");

fetch("/documentos").then((res) =>
  res
    .json()
    .then((documentos) => {
      guias.innerHTML = documentos
        .filter((x) => x.tipo == "guia")
        .map(
          (x) => `<li><a href="/documentos/${x.id}">${x.ayuntamiento}</a></li>`
        )
        .join("");

      ordenanzas.innerHTML = documentos
        .filter((x) => x.tipo == "ordenanza")
        .map(
          (x) => `<li><a href="/documentos/${x.id}">${x.ayuntamiento}</a></li>`
        )
        .join("");
    })
    .catch((error) => console.log(error))
);
