import Ember from 'ember';

export default Ember.Route.extend({
  pipeline: Ember.inject.service(),
  model: function() {
  },
  beforeModel:function(){
    this.set('pipelineStore.baseUrl',this.get('pipeline.pipelinesEndpoint'));
  },
});
