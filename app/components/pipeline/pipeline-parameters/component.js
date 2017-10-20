import Ember from 'ember';
var convertObjectToArry = function(obj) {
  var arry = [];
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      var value = obj[key];
      arry.push(key + '=' + value);
    }
  }
  return arry;
};

export default Ember.Component.extend({
  env:{},
  init(){
    this._super();
    var parameters=this.get('model.pipeline.parameters');
    var env={};
    if (parameters&&parameters.length) {
      for (var i = 0; i < parameters.length; i++) {
        var value = parameters[i].split('=');
        var k = value[0];
        var v = value[1];
        env[k] = v;
      }
      this.set('env',env);
    }
  },
  envObserves: function(){
    var env = this.get('env')
    this.set('model.pipeline.parameters',convertObjectToArry(env))
  }.observes('env.@each'),
  expandFn:function(item) {
    item.toggleProperty('expanded');
  },
});
