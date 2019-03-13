const path = require('path'); // Caminho válido independente de plataforma
const fs = require('fs'); // módulo de arquivo de sistema, usado para ler o conetúdo do arquivo
const solc = require('solc'); // Usado para compilar o código solidity
const dir_arquivo = '.contrato_compilado.js'


/* Caminho do arquivo .sol a ser compilado. Cada pasta é passada 
   como um argumento separado  
*/
const inboxPath = path.resolve(__dirname, 'contracts', 'Inbox.sol');

// Lê o que há dentro do arquivo .sol
const source = fs.readFileSync(inboxPath, 'utf8');

// Compila exporta o bytecode do contrato Inbox
//module.exports = solc.compile(source,1).contracts[':Inbox'];
const dados = solc.compile(source,1).contracts[':Inbox'];
//console.log(solc.compile(source,1).contracts[':Inbox']);

let contrato_compilado = 
`module.exports = {
    bytecode : '${dados['bytecode']}',
    interface : '${dados['interface']}'
}
`

// Cria um arquivo com o bytecode e a interface do contrato selecionado
fs.writeFile(dir_arquivo, contrato_compilado, function (err) {
    if (err) 
        return console.log(err);
    console.log('arquivo '+dir_arquivo+' criado.');
});
