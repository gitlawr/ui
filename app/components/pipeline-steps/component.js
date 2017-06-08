import Ember from 'ember';

export default Ember.Component.extend({
  sortFinishText: null,
  model: null,
  actions: {
    dragStart: function(object) {
      console.log('Drag Start', object);
    },
    sortEndAction: function() {
      console.log('Sort Ended', this.get('model.pages'));
    }
  }
});
