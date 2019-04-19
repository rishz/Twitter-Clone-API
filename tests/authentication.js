const { expect } = require("chai");
const chai = require("chai");
const chaiHttp = require("chai-http");
const mocha = require("mocha");
const server = require("../app.js");
const argon2 = require('argon2');

const User = require("../models/User");
const Follows = require("../models/Follows");
const Tweet = require("../models/Tweet");

const should = chai.should();

chai.use(chaiHttp);

/*
* Test the Authentication routes
*/
describe("Users", () => {

    before((done) => {
        (async () => {
            await User.deleteMany({});
            await Tweet.deleteMany({});
            await Follows.deleteMany({});

            const user = new User;
            user._id = "58b56e80d9da29fa6ed60093";
            user.email = "tester1@gmail.com";
            let password = '123456';
            let hash = await argon2.hash(password);
            user.password = hash;
            await user.save();

            const user2 = new User;
            user2._id = "58b56e9cd9da29fa6ed600a0";
            user2.email = "tester4@gmail.com";
            password = 'abcdef';
            hash = await argon2.hash(password);
            user2.password = hash;
            await user2.save();

            done();
        })();
    });

    /**
     * Tests login
     */
    describe("POST /api/user/login", () => {
        it("should log the user in", (done) => {
            chai.request(server)
            .post("/api/user/login")
            .send({email: "tester1@gmail.com", password: "123456"})
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.token.should.be.a("string");
                done();
            });
        });

        it("should not work without an email", (done) => {
            chai.request(server)
            .post("/api/user/login")
            .send({password: "12"})
            .end((err, res) => {
                res.should.have.status(400);
                res.body.error.should.be.eql("email not provided");
                done();
            });
        });

        it("should not work without a password", (done) => {
            chai.request(server)
            .post("/api/user/login")
            .send({email: "tester1@gmail.com"})
            .end((err, res) => {
                res.should.have.status(400);
                res.body.error.should.be.eql("password not provided");
                done();
            });
        });

        it("should not log the user in with a wrong password", (done) => {
            chai.request(server)
            .post("/api/user/login")
            .send({email: "tester1@gmail.com", password: "12"})
            .end((err, res) => {
                res.should.have.status(400);
                res.body.error.should.be.eql("You have entered a wrong password");
                done();
            });
        });
    });

    /**
     * Test registration
     */
    describe("POST /api/user/register", () => {
        it("should let the user register an account", (done) => {
            chai.request(server)
            .post("/api/user/register")
            .send({ email: "tester2@gmail.com", password: "548367432" })
            .end(async (err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                // Check mongo
                try {
                    const savedUser = await User.findOne({ email: "tester2@gmail.com" });
                    savedUser.email.should.be.equal("tester2@gmail.com");
                    savedUser.password.should.not.be.equal("548367432");
                    done();
                } catch (err) { done(err); }
            });
        }).timeout(30000);

        it("should not work without an email", (done) => {
            chai.request(server)
            .post("/api/user/register")
            .send({ password: "84774483" })
            .end((err, res) => {
                res.should.have.status(400);
                res.body.error.should.be.eql("email not provided");
                done();
            });
        });

        it("should not work without a password", (done) => {
            chai.request(server)
            .post("/api/user/register")
            .send({ email: "tester2@gmail.com" })
            .end((err, res) => {
                res.should.have.status(400);
                res.body.error.should.be.eql("password not provided");
                done();
            });
        });

        it("should not work with a duplicate email", (done) => {
            chai.request(server)
            .post("/api/user/register")
            .send({ email: "tester1@gmail.com", password: "84774483"})
            .end((err, res) => {
                res.should.have.status(400);
                res.body.error.should.be.eql("Email already exists. Try Logging in");
                done();
            });
        }).timeout(30000);
    });
});
