const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');

describe('googlePlayServer', () => {
    it('should return an array with all apps', () => {
        return supertest(app)
            .get('/apps')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
            })
    })

    it('should return a message from GET /apps', () => {
        return supertest(app)
            .get('/apps')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                expect(res.body).to.have.lengthOf.at.least(1);
                const app = res.body[0];
                expect(app).to.include.keys(
                    'App', 'Category', 'Rating', 'Reviews', 'Size', 'Installs'
                )
            })
    })

    it('should sort by rating', () => {
        return supertest(app)
            .get('/apps')
            .query({sort: 'rating'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                let sorted = true;
                let i = 0;
                while(i < res.body.length -1) {
                    const appAtI = res.body[i].Rating;
                    const appAtIPlus1 = res.body[i+1].Rating
                    if(appAtI < appAtIPlus1) {
                        sorted = false;
                        break;
                    }
                    i++;
                }
                expect(sorted).to.be.true;
            })
    })

    it('should sort by app name', () => {
        return supertest(app)
            .get('/apps')
            .query({sort: 'app'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                let sorted = true;
                let i = 0;
                while(i < res.body.length -1) {
                    const appAtI = res.body[i].App.toLowerCase();
                    const appAtIPlus1 = res.body[i+1].App.toLowerCase();
                    if(appAtI > appAtIPlus1) {
                        sorted = false;
                        break;
                    }
                    i++
                }
                expect(sorted).to.be.true;
            })
    })

    it('should filter by genre', () => {
        return supertest(app)
            .get('/apps')
            .query({genres: 'action'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                let filtered = true;
                let i = 0;
                while(i < res.body.length -1) {
                    const appAtI = res.body[i].Genres.toLowerCase();
                    if(!appAtI.includes('action')) {
                        filtered = false;
                        break;
                    }
                    i++
                }
                expect(filtered).to.be.true;

            })
    })
})