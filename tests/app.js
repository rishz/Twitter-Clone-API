const { expect } = require("chai");
const chai = require("chai");
const chaiHttp = require("chai-http");
const mocha = require("mocha");
const server = require("../app.js");
const mongoose = require("mongoose");
const config = require("../config/config");

const should = chai.should();

chai.use(chaiHttp);

describe("Twitter", () => {
    before((done) => {
        (async () => {
            mongoose.Promise = global.Promise;
            await mongoose.connect(config.testMongoHost);
            done();
        })();
    });

    /*
    * Test the /GET route
    */
    describe("GET /", () => {
        it("should provide basic information about the API", (done) => {
            chai.request(server)
                .get("/")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.html;
                    res.text.should.be.equal("Welcome to the Twitter API <br> Visit /api for the API functionality.");
                    done();
            });
        });

        it("should handle 404 correctly", (done) => {
            chai.request(server)
                .get("/lwkdngdkn")
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
            });
        });
    });
});
