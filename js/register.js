 const form = document.querySelector('form');
 const nameUser = document.querySelector('#nameUser');
 const ageUser = document.querySelector('#ageUser');

 document.querySelector('button').addEventListener('click',async (e)=>{
    e.preventDefault()
    try{
        
        if(!nameUser.value || nameUser.value == ""){throw new Error('Error >>> Name indefined')};
        if(!ageUser.value || ageUser.value == "")throw new Error('Error  >>> Age indefined');
        const user = {name:nameUser.value.toLowerCase(),age:Number(ageUser.value)};
        const option = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                },
            body: JSON.stringify(user)
        }
        const response = await fetch('http://localhost:3000/BD',option);
        if (!response.ok) {
            throw new Error('Erro na requisição: ' + response.statusText);
        }
    }catch(e){console.error(e)}
 })