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

const testToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU4YjU2ZTgwZDlkYTI5ZmE2ZWQ2MDA5MyIsImlhdCI6MTU1NTY4MDg2M30.9qfm4L6lUJiSQOj6El3cQQU97PGIU06klVF3EVTemHw";

/*
* Test the Tweet routes
*/
describe("Tweets", () => {
	before((done) => {
		(async () => {
			const tweet = new Tweet;
            tweet._id = "58b5ded262aa4ce02f64ebb1";
            tweet.body = "Hi! This is my first tweet.";
            tweet.author = "58b56e80d9da29fa6ed60093";
            await tweet.save();

            const tweet2 = new Tweet;
            tweet2._id = "58cd413bcead6102ad9d5081";
            tweet2.body = "Hi! This is my second tweet.";
            tweet2.author = "58b56e9cd9da29fa6ed600a0";
            await tweet2.save();

            done();
		})();
	});

	/**
     * Tests for the POST route
     */
    describe("POST /tweet", () => {
        it("should let a user create a tweet", (done) => {
            chai.request(server)
            .post("/api/tweet")
            .set("Authorization", `Bearer ${testToken}`)
            .send({
                body: "What is up?",
            })
            .end(async (err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.status.should.be.equal("success");
                res.body._id.should.be.a("string");
                const tid = res.body._id;
                try {
                    const tweet = await Tweet.findById(tid);
                    tweet.body.should.be.equal("What is up?");
                    tweet.author.toString().should.be.equal("58b56e80d9da29fa6ed60093");
                    done();
                } catch (err) { done(err); }
            });
        });

        it("should not work without a body", (done) => {
            chai.request(server)
            .post("/api/tweet")
            .set("Authorization", `Bearer ${testToken}`)
            .send()
            .end(async (err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.body.error.should.be.equal("body not provided");
                done();
            });
        });
    });


    /**
     * Tests for the get tweet route
     */
    describe("GET /tweet/:id", () => {
        it("should be able to retrieve an tweet by id", (done) => {
            chai.request(server)
            .get("/api/tweet/58b5ded262aa4ce02f64ebb1")
            .set("Authorization", `Bearer ${testToken}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.an("object");
                res.body._id.should.be.equal("58b5ded262aa4ce02f64ebb1");
                res.body.body.should.be.equal("Hi! This is my first tweet.");
                done();
            });
        });

        it("should not be able to retrieve tweets of another user", (done) => {
            chai.request(server)
            .get("/api/tweet/58cd413bcead6102ad9d5081")
            .set("Authorization", `Bearer ${testToken}`)
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.body.error.should.be.eql("User cannot see this tweet (not created by user)");
                done();
            });
        });
    });

    /**
     * Tests for the delete tweet route
     */
    describe("DELETE /tweet/:id", () => {
        it("should be able to delete an tweet by id", (done) => {
            chai.request(server)
            .delete("/api/tweet/58b5ded262aa4ce02f64ebb1")
            .set("Authorization", `Bearer ${testToken}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                done();
            });
        });

        it("should not be able to delete tweets of another user", (done) => {
            chai.request(server)
            .delete("/api/tweet/58cd413bcead6102ad9d5081")
            .set("Authorization", `Bearer ${testToken}`)
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.body.error.should.be.eql("User cannot delete this tweet (not created by user)");
                done();
            });
        });
    });
});