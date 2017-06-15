import Ember from 'ember';
// import C from 'ui/utils/constants';

export default Ember.Controller.extend({
  filtered: function() {
    let out = this.get('model');
    return out;
  }.property('model.@each.status'),
});
