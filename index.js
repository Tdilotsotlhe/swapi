const { ApolloServer, gql } = require("apollo-server");
const { RESTDataSource } = require("apollo-datasource-rest");

const typeDefs = gql`
  type Country {
    name: String!
    capital: String!
    population: Int!
  }

  type Person {
    name: String,
    height: String,
    mass: String,
    gender: String,
    homeworld: String,
  }
  type People{
    count: String
    next: String
    previous: String
    results: [Person]
  }

  type Query {
    allPeople: People!
    getByName(name: String!): People!
    getNextPage(page: Int!): People!
    countryByName(name: String!): Country!
  }
`;

const resolvers = {
  Query: {
    allPeople: async (parent, args, { dataSources }) => {
      return dataSources.swapi.getAllPeople();
    },
    getByName: async (parent, { name }, { dataSources }) => {
      return dataSources.swapi.searchByName(name);
    },
    //get indivdual for single view screen?
    // getPerson: async (parent, args, { dataSources }) => {
    //   return dataSources.swapi.getAllPeople();
    // },
    getNextPage: async (parent, { page }, { dataSources }) => {
      return dataSources.swapi.getNextPage(page);
    }
  }
};

class SWAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "https://swapi.dev/api";
  }

  //fetch all people
  async getAllPeople() {
    return this.get("/people/");
  }
  //search by name
  async searchByName(name) {
    return this.get(`/people/?search=${name}`);
  }

  //delete this
  async getCountryByName(name) {
    return this.get(`/name/${name}`);
  }

  //pagination add logic for page minimum value
  async getNextPage(page) {
    return this.get(`/people/?page=${page}`);
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => {
    return {
      swapi: new SWAPI()
    };
  }
});

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => console.log(`Server running on ${url}`));
