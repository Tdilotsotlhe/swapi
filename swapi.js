const { RESTDataSource } = require('apollo-datasource-rest');

export default class MoviesAPI extends RESTDataSource {
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
