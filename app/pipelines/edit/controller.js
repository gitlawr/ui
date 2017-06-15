import Ember from 'ember';

export default Ember.Controller.extend({
  stages: function(){
    var store = this.get('store')
    debugger
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
    },
    addStep(stage,step) {
      debugger
      let stages = this.get('stages')
      stages[stage]&&stages[stage].steps.pushObject(step)
    }
  }
});
