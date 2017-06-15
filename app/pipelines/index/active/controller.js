import Ember from 'ember';
export default Ember.Controller.extend({
  filtered: function() {
    let out = this.get('model');
    return out;
  }.property('model.@each.status'),
});
