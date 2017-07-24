import Ember from 'ember';
import WS from 'ui/mixins/pipelineWS';

export default Ember.Route.extend(WS, {
  pipeline: Ember.inject.service(),
  model: function() {},
  beforeModel: function() {
    this.set('pipelineStore.baseUrl', this.get('pipeline.pipelinesEndpoint'));
  },
  activate() {
    this._super();
    if (!this.controllerFor('application').get('isPopup') && this.get('projects.current')) {
      this.connectSubscribe();
    }
  },
  deactivate() {
    this._super();
    this.disconnectSubscribe();
    Ember.run.cancel(this.get('testTimer'));
  },
});
