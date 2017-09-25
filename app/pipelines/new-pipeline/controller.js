import Ember from 'ember';

export default Ember.Controller.extend({
  stages: function(){
    var pipeline = this.get('model.pipeline')
    pipeline.set('stages',[{
      name: 'SCM',
      steps: []
    }])
    return pipeline.stages
  }.property('model.pipeline'),
  errors: null,
  init(){
    this._super(...arguments);
    // this.set('model.pipeline', {
    //   ...this.get('model.pipeline'),
    //   isActivate: true
    // });
    // this.get('model').set('pipeline.isActivate', true);
    // debugger

    // Ember.set('model', 'pipeline.isAcivate', true);
  },
  didRender(){
    this._super(...arguments);
    // this.set('model.pipeline', {
    //   ...this.get('model.pipeline'),
    //   isActivate: true
    // });
    // this.set('model.pipeline.isActivate', true);
  },
  actions: {
    save: function(success){
      var model = this.get('model')
      var errors=model.pipeline.validationErrors()
      if(errors.length>0){
        this.set('errors',errors)
        success(false)
        return
      }
      model.pipeline.save().then(()=>{
        this.transitionToRoute('pipelines.ready.pipelines')
      })
    },
    cancel: function(){
      this.transitionToRoute('pipelines.ready.pipelines')
    }
  }
});
