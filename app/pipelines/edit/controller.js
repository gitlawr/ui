import Ember from 'ember';

export default Ember.Controller.extend({
  stages: function(){
    return this.get('model.pipeline.stages')
  }.property('model'),
  actions: {
    save: function(){
      var model = this.get('model.pipeline')
      var errors=model.pipeline.validationErrors()
      debugger
      console.log(model)
      // TODO send new pipeline to backend
      model.pipeline.update().then(()=>{
        this.transitionToRoute('pipelines.index.pipelines')
      })
    },
    cancel: function(){
      var model = this.get('model');
      this.transitionToRoute('pipeline',model.pipeline.id)
    }
  }
});