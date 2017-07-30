import Ember from 'ember';
import WS from 'ui/mixins/pipelineWS';
import PolledModel from 'ui/mixins/polled-model';

export default Ember.Route.extend(WS, PolledModel, {
  pipeline: Ember.inject.service(),
  pollInterval: 5000,
  model: function() {
    var pipeline = this.get('pipeline');
    return Ember.RSVP.hash({
      ready: pipeline.isReady()
    }).then((hash) => {
      return Ember.Object.create({
        ready: hash.ready,
      });
    })
  },
  beforeModel: function() {
    this.set('pipelineStore.baseUrl', this.get('pipeline.pipelinesEndpoint'));
  },
  afterModel: function(model) {
    if (model && model.ready.ready) {
      this.get('router').transitionTo('pipelines.ready');
    }
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
