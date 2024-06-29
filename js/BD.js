//Promisses
const userName = document.querySelector("#name");
const userAge = document.querySelector("#age");
const btn = document.querySelector("#find");
const allBtn = document.querySelectorAll(".allBtn");
let typeFind;

//função do back-end retornando os valores solicitados
function solicitedBD(type, value) {
  return new Promise((res, rej) => {

    if (!type) {
      rej(new Error("Dado invalido!"));
      return;
    }
    if (type) {
      const result = fetch('http://localhost:3000/BD')
      .then(resposnse=>resposnse.json())
      .then(json=>{
        return json.filter((e) => {

          if (type !== "age") {
           if(e[type] == value || e[type].includes(value))return true;
          }
          if (e[type] == value) return true;
          
        });
      })

      setTimeout(() => {
        res(result);
      }, 2000);
      return;
    }
  });
}

allBtn.forEach((e) => {
  e.addEventListener("click", (e) => {
    const el = e.target.classList.value;

     typeFind = el.split("-")[1];

    alterDataSpan(typeFind);
    document.querySelector(".inputOfData").classList.remove("activeInput");
    document.querySelector(".inputOfData").classList.add("activeInput");
    document.querySelector(".getFindData").classList.add("activeInput");
  });
});

btn.addEventListener("click", async () => {
  const valueInput = document.querySelector(".getFindData").value;
  let result = valueInput;

  if (typeFind == "age") {
    result = Number(valueInput);
  } else {
    result = valueInput;
  }
  
  load(true);
  try {

    const data = await solicitedBD(typeFind, result);
    showRequestedData(data);
    load(false);
    
  } catch (e) {
    console.log(e + "Dado inválido");
    load(false);
  }
});
function alterDataSpan(value) {
  document.querySelector("span").innerHTML = value;
}

function load(value) {
  if (value == true) {
    document.querySelector(".message").classList.add("active");
    document.querySelector(".spinner-Image").classList.add("active");
  }
  if (value == false) {
    document.querySelector(".message").classList.remove("active");
    document.querySelector(".spinner-Image").classList.remove("active");
  }
}

//respoonsavel por interar o banco com foreach e retornar o valores obtidos e enviar à table

function showRequestedData(data) {
  document.querySelector(".findDataInBD").style.display = "none";
  document.querySelector(".result").style.display = "block";
  data.forEach((item) => {
    console.log(item);
    document.querySelector("#tbody").innerHTML += `
            <tr>
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.age}</td>
            `;
  });
}
