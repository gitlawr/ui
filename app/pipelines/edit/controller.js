import Ember from 'ember';

export default Ember.Controller.extend({
  pipeline: function(){
    return Ember.Object.create({
      stages:this.get('model.pipeline.stages')
    })
  }.property('model.pipeline.stages'),
  actions: {
    cancel: function(){
      var model = this.get('model');
      this.transitionToRoute('pipeline',model.pipeline.id)
    }
  },
  pipelineEditActions: {
    addStep(stage,step) {
      let stages = this.get('pipeline.stages')
      stages[stage]&&stages[stage].push(step)
    }
  }
});
