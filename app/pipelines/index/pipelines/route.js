import Ember from 'ember';
import C from 'ui/utils/constants';

export default Ember.Route.extend({
  pipeline: Ember.inject.service(),
  model: function() {
    var pipelineStore = this.get('pipelineStore');
    var model = pipelineStore.find('pipeline',null,{forceReload: true});
    return model
  }
});
