import Ember from 'ember';

export default Ember.Component.extend({
  schedulePattern: function(){

  },
  expandFn:function(item) {
    item.toggleProperty('expanded');
  },
  schdulePattern: 'custome',
  schedule: function(){
    var pipeline = this.get('model.pipeline')
    return pipeline.trigger
  }.property('model'),
});
