const { ApolloServer, gql } = require('apollo-server');
const { RESTDataSource } = require('apollo-datasource-rest');
// import {MoviesAPI} from 'swap.js';

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  type Person {
    name: String,
    height: String,
    mass: String,
    gender: String,
    homeworld: String,
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
  }

  type Query {
    people: [Person]
  }
  
  type Query {
    allPeople: [Person!]!
  }
`;


//define data set, will be API call to SWAPI
const books = [
    {
      title: 'The Awakening',
      author: 'Kate Chopin',
    },
    {
      title: 'City of Glass',
      author: 'Paul Auster',
    },
  ];

  //name, height, mass, gender, homeworld
  const people = [
    {
      name: 'The Awakening',
      height: 'Kate Chopin',
      mass: '100kg',
      gender: 'They',
      homeworld: 'Goobies',
    },
    {
      name: 'TheOtherPerson',
      height: 'Kate Chopin',
      mass: '100kg',
      gender: 'They',
      homeworld: 'Goobies',
    },
  ];

  //Resolver tell Apollo Server how to fetch the data associated with a particular type
  const resolvers = {
    Query: {
      books: () => books,
      people: () => people,
      allPeople: async (parent, args, { dataSources }) => {
        return dataSources.MoviesAPI.getAllPeople();
      }
    },
  };


  class MoviesAPI extends RESTDataSource {
    constructor() {
      // Always call super()
      super();
      // Sets the base URL for the REST API
      this.baseURL = 'https://swapi.dev/';
    }
  
    async getAllPeople() {
      // Send a GET request to the specified endpoint
      return this.get(`people/`);
    }
  
    async getPeopleByPage(page) {
      // Send a GET request to the specified endpoint
      return this.get(`https://swapi.dev/api/people/?page=${encodeURIComponent(page)}`);
    }
  
    async getPeopleByName(page) {
      // Send a GET request to the specified endpoint
      return this.get(`https://swapi.dev/api/people/?page=${encodeURIComponent(page)}`);
    }
  
    async getMostViewedMovies(limit = 10) {
      const data = await this.get('movies', {
        // Query parameters
        per_page: limit,
        order_by: 'most_viewed',
      });
      return data.results;
    }
  }


  const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => {
      return {
        moviesAPI: new MoviesAPI()
      };
    }
  });
  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
