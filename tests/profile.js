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
* Test the Profile routes
*/
describe("Profile", () => {
	describe("POST /profile/:id/follow", () => {
        it("should let the user follow other user", (done) => {
            chai.request(server)
            .post("/api/profile/58b56e9cd9da29fa6ed600a0/follow")
            .set("Authorization", `Bearer ${testToken}`)
            .end(async (err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.status.should.be.equal("success");
                try {
                    const follow = await Follows.findOne({ followee: "58b56e80d9da29fa6ed60093", follower: "58b56e9cd9da29fa6ed600a0" });
                    follow.followee.toString().should.be.equal("58b56e80d9da29fa6ed60093");
                    follow.follower.toString().should.be.equal("58b56e9cd9da29fa6ed600a0");
                    done();
                } catch (err) { done(err); }
            });
        });

        it("should not let users make duplicate requests", (done) => {
            chai.request(server)
            .post("/api/profile/58b56e9cd9da29fa6ed600a0/follow")
            .set("Authorization", `Bearer ${testToken}`)
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.body.error.should.be.equal("You are already a follower");
                done();
            });
        });

        it("should not let users friend themselves", (done) => {
            chai.request(server)
            .post("/api/profile/58b56e80d9da29fa6ed60093/follow")
            .set("Authorization", `Bearer ${testToken}`)
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.body.error.should.be.equal("You cannot follow yourself");
                done();
            });
        });
    });

    describe("POST /profile/:id/unfollow", () => {
        it("should let the user unfollow other user", (done) => {
            chai.request(server)
            .post("/api/profile/58b56e9cd9da29fa6ed600a0/unfollow")
            .set("Authorization", `Bearer ${testToken}`)
            .end(async (err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.status.should.be.equal("success");
                try {
                    const follow = await Follows.findOne({ followee: "58b56e80d9da29fa6ed60093", follower: "58b56e9cd9da29fa6ed600a0" });
                    console.log(follow);
                    should.equal(follow, null);
                    done();
                } catch (err) { done(err); }
            });
        });

        it("should not let users make duplicate requests", (done) => {
            chai.request(server)
            .post("/api/profile/58b56e9cd9da29fa6ed600a0/unfollow")
            .set("Authorization", `Bearer ${testToken}`)
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.body.error.should.be.equal("You are already not a follower");
                done();
            });
        });
    });
});