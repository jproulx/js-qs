var should = require('should');
var qs     = require('./querystring');
describe('QueryString', function () {
    describe('.decode', function () {
        it('should ignore leading characters', function (done) {
            qs.decode('?').should.eql({});
            qs.decode(' ').should.eql({});
            return done();
        });
        it('should decode basic pairs', function (done) {
            var result = qs.decode('foo=bar');
            result.should.be.an.Object;
            result.should.eql({'foo':'bar'});
            return done();
        });
        it('should decode single keys', function (done) {
            var result = qs.decode('foo');
            result.should.be.an.Object;
            result.should.eql({'foo':''});
            return done();
        });
        it('should decode plusses to spaces properly', function (done) {
            var result = qs.decode('foo+bar=++test+test++');
            result.should.be.an.Object;
            result.should.eql({'foo bar':'  test test  '});
            return done();
        });
        it('should coerce identical keys into arrays', function (done) {
            var result = qs.decode('foo=bar&foo=baz&foo=test');
            result.should.be.an.Object;
            result.should.eql({'foo':['bar','baz','test']});
            return done();
        });
        it('should respect a maximum number of keys to parse', function (done) {
            qs.decode('foo=bar&bar=baz&test=test', { 'maxKeys' : 1 }).should.eql({'foo':'bar'});
            return done();
        });
    });
    describe('.encode', function () {
        it('should encode pairs', function (done) {
            qs.encode({'foo':'bar'}).should.equal('foo=bar');
            return done();
        });
        it('should URI encode', function (done) {
            qs.encode({'foo bar': 'baz faz'}).should.equal('foo%20bar=baz%20faz');
            return done();
        });
        it('should handle array values', function (done) {
            qs.encode({abc: 'abc', foo: ['bar', 'baz']}).should.equal('abc=abc&foo=bar&foo=baz');
            return done();
        });
        it('should allow for a different separator', function (done) {
            qs.encode({abc: 'abc', foo: ['bar', 'baz']}, {'separator':';'}).should.equal('abc=abc;foo=bar;foo=baz');
            return done();
        });
        it('should allow for a different assignor', function (done) {
            qs.encode({abc: 'abc', foo: ['bar', 'baz']}, {'equals':'|'}).should.equal('abc|abc&foo|bar&foo|baz');
            return done();
        });
    });
});
