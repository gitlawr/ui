import Ember from 'ember';

export default Ember.Route.extend({
  pipeline: Ember.inject.service(),
  queryParams: {
    status: {
      refreshModel: true
    },
  },
  model: function() {
    var pipeline = this.get('pipeline');
    if(!pipeline.ready||!pipeline.ready.ready){
      return []
    }
    var pipelineStore = this.get('pipelineStore');
    var model = pipelineStore.findAll('activity');
    return model
  }
});
