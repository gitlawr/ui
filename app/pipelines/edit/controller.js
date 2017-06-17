import Ember from 'ember';

export default Ember.Controller.extend({
  stages: function(){
    return this.get('model.pipeline.stages')
  }.property('model'),
  actions: {
    save: function(){
      var model = this.get('model.pipeline')
      console.log(model)
      // TODO send new pipeline to backend
    },
    cancel: function(){
      var model = this.get('model');
      this.transitionToRoute('pipeline',model.pipeline.id)
    }
  }
});
