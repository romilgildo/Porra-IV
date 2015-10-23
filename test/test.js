var request = require('supertest'), 
should = require('should'),
app = require('../app.js');
want_id = "mad-bcn-liga-2014";

describe( "Crear porra", function() {
	it('should create', function (done) {
		request(app)
			.put('/porra/local/visitante/copa/2014')
			.expect('Content-Type', /json/)
			.expect(200,done);
	});
});

describe( "Leer ID porra", function() {
	it('should return ID', function (done) {
		request(app)
			.put('/porra/mad/bcn/liga/2014')
			.expect('Content-Type', /json/)
			.expect(200)
			.end( function ( error, resultado ) {
				if ( error ) {
					return done( error );
				}
				resultado.body.should.have.property('ID', want_id);
				done();
			});
	});
});

describe( "Crear apuesta", function() {
	it('should create bet correctly', function (done) {
		request(app)
			.put('/apuesta/mendas/liga/2014/mad/2/bcn/2')
			.expect('Content-Type', /json/)
			.expect(200,done);
	});
});
			
describe( "Leer ID apuesta", function() {
	it('should return ID', function (done) {
		request(app)
			.put('/apuesta/mendas/liga/2014/mad/2/bcn/2')
			.expect('Content-Type', /json/)
			.expect(200)		
			.end( function ( error, resultado ) {
				if ( error ) {
					return done( error );
				}
				resultado.body.should.have.property('local','2');
				resultado.body.should.have.property('visitante','2');
				done();
			});
    });
});
