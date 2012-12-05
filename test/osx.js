var keychain = require('../');

describe('Kchain', function(){
  var testService = 'Kchain#test#' + Date.now();

  it('should be running on a mac', function(){
    console.log(require('os').platform())
    require('os').platform().should.equal('darwin');
  })

  it('should have access to ' + keychain.execPath, function(){
    require('fs').existsSync(keychain.execPath).should.equal(true);
  })

  describe('.set(opts, fn)', function(){

    describe('when no account is given', function(){
      it('should return an error', function(done){
        keychain.set({ password: 'baz', service: testService }, function(err) {
          if (!err) throw new Error();
          done();
        });
      })
    });

    describe('when no service is given', function(){
      it('should return an error', function(done){
        keychain.set({ account: 'foo', password: 'baz' }, function(err) {
          if (!err) throw new Error();
          done();
        });
      })
    });

    describe('when no password is given', function(){
      it('should return an error', function(done){
        keychain.set({ account: 'foo', service: testService }, function(err) {
          if (!err) throw new Error();
          done();
        });
      })
    });

    describe('when sent { account: "drudge", password: "test", service: "' + testService + '" }', function(){
      it('should return "test"', function(done){
        keychain.set({ account: "drudge", password: "test", service: testService }, function(err) {
          if (err) throw err;
          done();
        });

      })
    })
  })

  describe('.get(opts, fn)', function(){

    describe('when no account is given', function(){
      it('should return an error', function(done){
        keychain.set({ password: 'baz', service: testService }, function(err) {
          if (!err) throw new Error();
          done();
        });
      })
    });

    describe('when no service is given', function(){
      it('should return an error', function(done){
        keychain.set({ account: 'foo', password: 'baz' }, function(err) {
          if (!err) throw new Error();
          done();
        });
      })
    });

    describe('when sent { account: "drudge", service: "' + testService +'" }', function(){
      it('should return "test"', function(done){
        keychain.get({ account: "drudge", service: testService }, function(err, pass) {
          if (err) throw err;

          pass.should.equal("test");
          done();
        });
      })
    })

    describe('when sent { account: "drudge", service: "' + testService + '#NOTEXIST' +'" }', function(){
      it('should return an error', function(done){
        keychain.get({ account: "drudge", service: testService + '#NOTEXIST' }, function(err, pass) {
          if (!err) throw new Error();
          done();
        });
      })
    })

  })

  describe('.rm(opts, fn)', function(){

    describe('when no account is given', function(){
      it('should return an error', function(done){
        keychain.rm({ password: 'baz', service: testService }, function(err) {
          if (err) {
            done();
            return;
          }
          done(new Error());
        });
      })
    });

    describe('when no service is given', function(){
      it('should return an error', function(done){
        keychain.rm({ account: 'foo', password: 'baz' }, function(err) {
          if (!err) throw new Error();
          done();
        });
      })
    });

    describe('when sent { account: "drudge", service: "' + testService + '" }', function(){
      it('should return a password of "test"', function(done){
        keychain.rm({ account: "drudge", service: testService }, function(err) {
          if (err) throw err;
          done();
        });
      })
    })

    describe('when sent the same options again', function(){
      it('should return an error', function(done){
        keychain.rm({ account: "drudge", service: testService }, function(err) {
          if (!err) throw new Error();
          done();
        });
      })
    })

  });

});
