import Ember from 'ember';

export default Ember.Component.extend({
  sortFinishText: null,
  model: null,
  sortingScope: function(){
    return this.get('stageId')
  }.property('stageId'),
  actions: {
    dragStart: function(object) {
      console.log('Drag Start', object);
    },
    sortEndAction: function() {
      console.log(this.get('stageId'));
      console.log('Sort Ended', this.get('model.pages'));
    }
  }
});
