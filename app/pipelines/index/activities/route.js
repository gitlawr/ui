import Ember from 'ember';

export default Ember.Route.extend({
  queryParams: {
    status: {
      refreshModel: true
    },
  },
  pipeline: Ember.inject.service(),
  model: function() {
    var pipelineStore = this.get('pipelineStore');
    var model = pipelineStore.findAll('activity', null, { forceReload: true });
    return model
  }
});
