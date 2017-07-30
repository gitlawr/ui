import Ember from 'ember';

export default Ember.Controller.extend({
  init(){
    this._super(...arguments);
    var model = this.get('model');
  }
});