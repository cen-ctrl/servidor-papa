const postForm = document.querySelector("#post-form");
const deleteForm = document.querySelector("#delete-form");

postForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const ayuntamiento = document.getElementById("ayuntamiento");
  const guia = document.getElementById("guia");
  const archivo = document.getElementById("archivo");

  const formData = new FormData();
  formData.append("ayuntamiento", ayuntamiento.value);
  if (guia.checked) formData.append("tipo", "guia");
  else formData.append("tipo", "ordenanza");
  formData.append("archivo", archivo.files[0]);

  fetch("./documentos", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) =>
      alert(`Su archivo ha sido añadido con un ID de : ${data.fileID}`)
    )
    .catch((e) => console.log("An error has ocurred", e));
});

deleteForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const ID = document.getElementById("id-to-delete").value;

  fetch(`/documentos/${ID}`, { method: "DELETE" })
    .then((res) => res.json())
    .then((data) => {
      if (data.status == "element not found")
        alert("El elemento requerido no ha sido encontrado.");
      if (data.status == "error") alert("Hubo un error con su petición.");
      if (data.status == "succeded")
        alert(
          "Su petición se ha realizado con éxito. El archivo ha sido eliminado."
        );
    })
    .catch((err) => alert("Hubo un error con su petición."));
});
