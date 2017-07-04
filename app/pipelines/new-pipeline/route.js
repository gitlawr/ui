import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    var pipelineStore = this.get('pipelineStore');
    var pipeline = pipelineStore.createRecord({type:'pipeline'})
    return Ember.Object.create({
        pipeline: pipeline
      });
  }
});