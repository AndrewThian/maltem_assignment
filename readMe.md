## Maltem Assignment
Created a backend with a simple model-controller, frontend with jQuery and AJAX request to query my database.

#### Instructions
1. run `npm install`
2. Create a .env file and input `API_KEY=yourAPIkeyhere`
3. run `npm test` for testing environment
4. run `mongod`
5. run `npm run dev` for development environment

cd into `public` folder:

1. open index.html  
2. profit!!!! translate awayyyyyy

## Comments
There were some deviations from the actual brief in terms of implementation, I used `.expect` instead of `.should` as I was more familiar with `.expect`. I also didn't use `config` to manage my environments but simply used NODE_ENV as I did not have enough time to persue the documentations. If given a little more time, I would definitely refactor these discrepancies. With that said, hopefully my comments and code are up to par with the requirements.

**EDIT**
managed to use `config` to load my environment variables! Updated with config file consisting of test, dev, production environments.

## Modules
* [request](https://www.npmjs.com/package/request) - http client to query API.
* [express](https://www.npmjs.com/package/express) - web framework
* [dotenv](https://www.npmjs.com/package/dotenv) - loads environment variables
* [mocha, chai, supertest](https://mochajs.org/) - for testing!
* [config](https://github.com/lorenwest/node-config/wiki/Configuration-Files) - for configuring environments

## License
Yandex Translate terms of service: http://legal.yandex.com/translate_api/
