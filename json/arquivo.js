const { error } = require('console');
const fs = require('fs');
const { exit } = require('process');
const { json } = require('stream/consumers');

let LerArquivoBroken = function(location) {
    let data
    try {
        data = fs.readFileSync(location, 'utf-8');
    } catch{
        console.log("O arquivo não pode ser lido")
    }
    try {
        jsonData = JSON.parse(data);
    } catch (e) {
        if ( e instanceof SyntaxError){
            console.log("O arquivo não pode ser lido pois não é um arquivo JSON")
        }
    }
    if (jsonData.length == 0) {
        throw new Error ("O array esta vazio")
    }
    for (let i = 0; i < jsonData.length; i++){
        //Validação do arquivo broken_database_1
        //if (typeof jsonData[i].nome != "string") 
            //throw new Error("O atributo name precisa ser do tipo string, e o objeto numero " + i + " o atributo nome não é uma string")
        //if (typeof jsonData[i].id_marca_ != "number")
            //throw new Error("O atributo id precisa ser do tipo number")
        //Validação do arquivo broken_database_1
        if (typeof jsonData[i].nome != "string") 
            throw new Error("O atributo nome precisa ser do tipo string, e o objeto numero " + i + " o atributo nome não é uma string")
        if (typeof jsonData[i].id_marca_ != "number")
            throw new Error("O atributo id_marca_ precisa ser do tipo number")
    }
    
    return jsonData
}


let CorrecaoNomeMarca = function(jsonArray) {
    for (let i = 0; i < jsonArray.length; i++) {
        jsonArray[i].nome = jsonArray[i].nome.replace(/æ/g, "a").replace(/ø/g, "o")//Codigo para arrumar nomes referente ao arquivo broken_database_1.json
        //jsonArray[i].marca = jsonArray[i].marca.replace(/æ/g, "a").replace(/ø/g, "o")//Codigo para arrumar as marcas referente ao arquivo broken_database_2.json
    }
    return jsonArray
}

let CorrecaoVendas = function(jsonArray){
    for (let i = 0; i < jsonArray.length; i++) {
        jsonArray[i].vendas = Number.parseFloat(jsonArray[i].vendas)
    }
    return jsonArray
}

let dados = LerArquivoBroken('./broken_database_1.json') //Variavel para abrir dados do arquivo broken_database_1.json
//let dados = LerArquivoBroken('./broken_database_2.json')//Variavel para abrir dados do arquivo broken_database_2.json
dados = CorrecaoNomeMarca(dados)
dados = CorrecaoVendas(dados)

console.log("\nDados Organizados")
console.log(dados)

fs.writeFile("broken_database_1_correto.json", JSON.stringify(dados,null,2),
  {
    encoding: "utf8",
    flag: "w",
    mode: 0o666
  },(err) => {
    if (err)
      console.log(err);
    else {
      console.log("\nArquivo gravado com sucesso!");
    }
});

/*Código em SQL usado para fazer a junção do arquivo broken_database_1_correto.json
 com o arquivo broken_database_2_correto.json

SELECT * FROM broken_database_1_correto
FULL JOIN broken_database_2_correto
on broken_database_1_correto.c2 = broken_database_2_correto.c1
*/