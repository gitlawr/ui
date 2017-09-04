import Ember from 'ember';

export default Ember.Route.extend({
  queryParams: {
    status: {
      refreshModel: true
    },
  },
  model: function() {
    var pipelineStore = this.get('pipelineStore');
    var model = pipelineStore.findAll('activity');
    return model
  }
});
