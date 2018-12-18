const app = require('../quaalude');
const http = require('http');
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);

describe ('Test All Routes', () => {
    
    describe ('Test root /', () => {
        it ('... should respond to the GET method', (done) => {
            chai.request(app)
                .get('/')
                .end ((err, res) => {
                    res.should.have.status(200);
                });
                done();
        });
    });

    describe ('Test tsdata/', () => {
        it ('... should respond to the GET method', (done) => {
            chai.request(app)
                .get('tsdata/')
                .end ((err, res) => {
                    res.should.have.status(200);
                });
                done();
        });
    });

    after ( () => { app.stop() }  );
});
