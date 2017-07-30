import Ember from 'ember';

export default Ember.Controller.extend({
  stages: function(){
    return this.get('model.pipeline.stages')
  }.property('model'),
  actions: {
    save: function(){
      var model = this.get('model.pipeline')
      model.pipeline.update().then(()=>{
        this.transitionToRoute('pipelines.ready.pipelines')
      })
    },
    cancel: function(){
      var model = this.get('model');
      this.transitionToRoute('pipeline',model.pipeline.id)
    }
  }
});
