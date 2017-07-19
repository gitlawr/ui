import Ember from 'ember';

export default Ember.Component.extend({
  schedulePattern: function(){

  },
  expandFn:function(item) {
    item.toggleProperty('expanded');
  },
  schdulePattern: 'custome',
  pipeline: function(){
    var pipeline = this.get('model.pipeline')
    return pipeline
  }.property('model'),
});
