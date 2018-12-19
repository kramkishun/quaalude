const app = require('../quaalude');
const http = require('http');
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);

// Note that the Python flask app must be running for some of these tests to pass,
// otherwise timeouts will occur.
describe ('Test All Routes', () => {
    
    describe ('Test root /', () => {
        it ('... should respond to the GET method', async () => {
            let response = await chai.request(app).get('/');
            response.should.have.status(200);
        });
    });

    describe ('Test /tsdata/', () => {
        it ('... should respond to the GET method', async () => {
            let response = await chai.request(app).get('/tsdata/AAPL');
            response.should.have.status(200);
        });

        it ('... should respond when a bad symbol is provided', async () => {
            let response = await chai.request(app).get('/tsdata/DOESNTEXIST');
            response.should.have.status(200);
        });

        it ('... should respond with an error when a bad symbol is provided', async () => {
            let response = await chai.request(app).get('/tsdata/DOESNTEXIST');
            response.body.should.be.eql(JSON.parse('{"error":"NoSuchSymbol"}'));
        });
    });

    describe ('Test /multitsdata/', () => {
        it ('... should respond to the GET method', async () => {
            let response = await chai.request(app).get('/multitsdata?symbols=AAPL');
            response.should.have.status(200);
        });
    });

    describe ('Test /news/', () => {
        it ('... should respond to the GET method', async () => {
            let response = await chai.request(app).get('/news/AAPL');
            response.should.have.status(200);
        });
    });

    describe ('Test /returndata/', () => {
        it ('... should respond to the GET method', async () => {
            let response = await chai.request(app).get('/returndata/AAPL');
            response.should.have.status(200);
        });
    });

    describe ('Test /stats/', () => {
        it ('... should respond to the GET method', async () => {
            let response = await chai.request(app).get('/stats/AAPL');
            response.should.have.status(200);
        });
    });

    after ( () => { app.stop() }  );
});
