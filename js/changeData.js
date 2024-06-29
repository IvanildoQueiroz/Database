
class ChangeData {
  constructor(data = '', typeData = '') {
    this.data = data;
    this.typeData = typeData;
    this.selectedData = null;
    this.initializeEventListeners();
  }

  static verifyData(data) {
    if (data === undefined || data === null || data === "") {
      console.log("Dado inválido >>> " + data);
      return false;
    }
    return true;
  }

  // Pega os dados de busca fornecidos pelo usuário
  initializeEventListeners() {
    document.querySelector("select").addEventListener("change", (e) => {
      this.typeData = e.target.value;
    });

    document.querySelector("#data").addEventListener("input", (e) => {
      this.data = e.target.value;
    });
  }

  async getAPI() {
        if (!ChangeData.verifyData(this.data)) return;
    
        const URL = "http://localhost:3000/BD";
    
        try {
          const response = await fetch(URL);
          const json = await response.json();
    
          const result = json.filter((e) => {
            if (e[this.typeData] !== "age") {
              if (
                e[this.typeData] == this.data ||
                e[this.typeData].includes(this.data)
              )
                return true;
            }
            if (e[this.typeData] == this.data) return true;
          });
          this.createListData(result, URL);
          return result;
        } catch (error) {
          console.error("Error fetching data:", error);
          throw error;
        }
      }

  // Mostra na interface do usuário o retorno da requisição - chamada pelo getAPI
  createListData(data, URL) {
    const panel = document.querySelector(".message");
    panel.innerHTML = ''; // Clear the previous results
    data.forEach((element) => {
      let { name, age, id } = element;
      this.showResultInInterface(name, age, id);
    });
    this.selectResult(URL);
  }

  // Pega o clique do usuário no qual irá alterar os dados
  selectResult(URL) {
    document.querySelectorAll('.message li').forEach(item => {
      item.addEventListener('click', (e) => {
        // Remove a classe 'Data-selected' de todos os itens
        document.querySelectorAll('.message li').forEach(li => li.classList.remove('Data-selected'));

        // Adiciona a classe 'Data-selected' ao item clicado
        e.currentTarget.classList.add('Data-selected');

        // Extrai os dados do item clicado
        const data = e.currentTarget.textContent.split(' ');
        const id = data[1];
        const name = data[3];
        const age = data[5];
        console.log(age)
        // Armazena os dados selecionados
        this.selectedData = { URL, id, name, age };
      });
    });
  }

  // Mostra o resultado pesquisado para ser alterado no display de retorno
  showResultInInterface(name, age, id) {
    const panel = document.querySelector(".message");

    const li = document.createElement("li");
    li.innerHTML = `id= ${id} Name= ${name} Age= ${age}`;
    panel.appendChild(li);
  }

  // Alterar dados no banco
  async alterarDados(newName,newAge) {
    if (!this.selectedData) {
      console.error('Nenhum dado selecionado para alteração.');
      return;
    }

    const { URL, id, name, age } = this.selectedData;
    const { url, idUser, nameUser, ageUser} = this.dataToChange(URL, id, name, age);


    try {
      const response = await fetch(`${url}/${idUser}`, {  // Corrigido para usar URL com ID
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id:1,
          name: newName,
          age: newAge,
        }),
      });
      console.log(name)
      if (response.ok) {
        console.log("Dados alterados com sucesso!");
      } else {
        console.error("Erro ao alterar dados:", response.statusText);
      }
    } catch (error) {
      console.error("Erro ao alterar dados:", error);
    }
  }

  dataToChange(URL, id, name, age) {
    // Pega o id do usuário selecionado
    let idUser = id;
    console.log(idUser);
    // Pega o nome do usuário selecionado
    let nameUser = name;
    // Pega a idade do usuário selecionado
    let ageUser = age;
    // Pega a url
    let url = URL;

    return { idUser, nameUser, ageUser, url };
  }

  // Verificar se o dado é válido
  startSearch() {
    this.getAPI();
  }
}

const alterData = new ChangeData();
document.querySelector("#btn-search").addEventListener("click", () => {
  alterData.startSearch();
});
document.querySelector("#submit").addEventListener("click", (e) => {
  e.preventDefault();
  const name = document.querySelector('#name').value;
  const age = document.querySelector('#age').value;
  alterData.alterarDados(name,age);
});