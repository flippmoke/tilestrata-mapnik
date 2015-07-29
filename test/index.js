var tilestrata = require('tilestrata');
var TileServer = tilestrata.TileServer;
var TileRequest = tilestrata.TileRequest;
var mapnik = require('../index.js');
var assert = require('chai').assert;
var fs = require('fs');

describe('Provider Implementation "mapnik"', function() {
	describe('serve()', function() {
		it('should render tile', function(done) {
			var server = new TileServer();
			var req = TileRequest.parse('/layer/0/0/0/tile.png');

			var provider = mapnik({xml: __dirname + '/data/test.xml'});
			provider.init(server, function(err) {
				assert.isFalse(!!err);
				provider.serve(server, req, function(err, buffer, headers) {
					assert.isFalse(!!err);
					assert.deepEqual(headers, {'Content-Type': 'image/png'});
					assert.instanceOf(buffer, Buffer);

					var im_actual = buffer.toString('base64');
                    var expected = __dirname + '/fixtures/world.png';
                    if (!fs.existsSync(expected) || process.env.UPDATE)
                    {
                        fs.writeFileSync(expected, buffer);
                    }
					var im_expected = fs.readFileSync(expected).toString('base64');
					assert.equal(im_actual, im_expected);

					done();
				});
			});
		});
		it('should render interactivity tiles', function(done) {
			var server = new TileServer();
			var req = TileRequest.parse('/layer/0/0/0/tile.json');

			var provider = mapnik({xml: __dirname + '/data/test.xml', interactivity: true});
			provider.init(server, function(err) {
				assert.isFalse(!!err);
				provider.serve(server, req, function(err, buffer, headers) {
					assert.isFalse(!!err);
					assert.deepEqual(headers, {'Content-Type': 'application/json'});
					assert.instanceOf(buffer, Buffer);

                    var expected = __dirname + '/fixtures/world.json';
                    if (!fs.existsSync(expected) || process.env.UPDATE)
                    {
                        fs.writeFileSync(expected, buffer);
                    }
					var data_actual = buffer.toString('base64');
					var data_expected = fs.readFileSync(expected).toString('base64');
					assert.equal(data_actual, data_expected);

					done();
				});
			});
		});
	});
});
