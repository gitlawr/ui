import Ember from 'ember';
import C from 'ui/utils/constants';

export default Ember.Route.extend({
  pipeline: Ember.inject.service(),
  model: function() {
    var pipelineStore = this.get('pipelineStore');
    var model = pipelineStore.findAll('pipeline',null,{forceReload: true});
    return model
  }
});
