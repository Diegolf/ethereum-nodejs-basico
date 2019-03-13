const assert = require('assert'); // Usado para comparar valores
const ganache = require('ganache-cli'); // Local teste ethereum network
const Web3 = require('web3'); // Portal para acessar a rede ethereum
const web3 = new Web3(ganache.provider()); // Instância do Web3, parâmetro diz respeito à network que será acessada
const { interface, bytecode } = require('./.contrato_compilado.js'); // Recebe as propriedades (informadas pelas chaves do dicionário) retornadas pelo arquivo

const infura = 'https://rinkeby.infura.io/v3/25977de568b74e87b48cb583b4b0c44a';

// String inicial usada para "isntanciar" o contrato
const INITIAL_STRING = 'Hi there!';

let accounts;
let inbox;

before(async () =>{
    // Pega uma lista de contas de forma assíncrona
    accounts = await web3.eth.getAccounts();

    // Use one of those account to deploy the contract
    // Ensina a web3 quais métodos o contrato Inbox tem (pela interface)
    inbox = await new web3.eth.Contract(JSON.parse(interface))

        // Diz à web3 que queremos adicionar uma cópia desse contrato
        .deploy({data: bytecode, arguments: [INITIAL_STRING]})
    
        // Instrui a web3 à enviar uma transação que cria esse contrato
        .send({ from: accounts[0], gas: '1000000'});
});

beforeEach(async () => {
    // console.log('Executa uma vez antes de cada "IT"');
});

describe('Inbox',() => {
    it('Deploys a contract', () =>{
        // Verifica se o 'inbox' tem um endereço, se sim significa que ele foi enviado com sucesso
        assert.ok(inbox.options.address);
    });

    it('Has a default message', async () =>{
        const message = await inbox.methods.message().call();
        assert.equal(message, INITIAL_STRING);
    });

    it('Can change the message', async () =>{
        // Caso ocorra um erro o código abaixo não vai funcionar
        await inbox.methods.setMessage('Bye').send({from: accounts[0]}); // Para modificar dados utiliza send ; <quemPagar>,<>
        const message = await inbox.methods.message().call();
        assert.equal(message,'Bye');
    });
});
// Link copiado do Infura
// https://rinkeby.infura.io/v3/25977de568b74e87b48cb583b4b0c44a


/* Exemplo de teste utilizando mocha
// Para rodar o teste é necessário mudar a string de test em "package.json" para "mocha"
class Car {

    park(){
        return 'stopped';
    }

    drive(){
        return 'vroom';
    }
}

let car;

// Executado antes de cada "it". Código em comum dentre cada "it"
beforeEach(() => {
    car = new Car();
    // console.log('quantas vezes esta string vai aparecer?'); // uma para cada it
});

// describe serve para agrupar "IT functions 
describe('Car test',() => {

    // Cada it function é um teste que realiza uma comparação
    it('Park should return a string',() => {        
        assert.equal(car.park(), 'stopped');
    });

    it('Can drive',() => {
        assert.equal(car.drive(), 'vroom');
    });

    it('Este teste vai dar errado',() => {
        assert.equal(car.park(), 'stoped');
    });
}); 
*/