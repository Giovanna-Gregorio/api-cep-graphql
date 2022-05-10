var fetch = require('node-fetch');
var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type CEP {
    logradouro: String,
    bairro: String,
    localidade: String,
    uf: String
  }

  type Query {
    consultaCep(cep: String!) : CEP
  }
`);

// The rootValue provides a resolver function for each API endpoint
var rootValue = {
  consultaCep: async ({cep}) => {
    let response = await fetch("https://viacep.com.br/ws/" + cep + "/json/");

    if(response.status == 200) {
        return response.json()
    } else {
        throw new Error('Something bad request')
    }
  },
};

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: rootValue,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');