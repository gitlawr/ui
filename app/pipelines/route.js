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
      return {
        ready: hash.ready,
        cancelTimer: ()=>{
          this.cancelTimer();
        }
      };
    })
  },
  beforeModel: function() {
    this.set('pipelineStore.baseUrl', this.get('pipeline.pipelinesEndpoint'));
  },
  afterModel: function(model) {
    debugger
    if (model && model.ready.ready) {
      var router = this.get('router');
      var targetName = router.router.activeTransition.targetName
      if(targetName==='pipelines.index'){
        router.transitionTo('pipelines.ready');
      }else{
        router.transitionTo(targetName);
      }
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

  actions: {
    willTransition(transition) {
      debugger
      var model = this.controller.get('model')
      if (model && model.ready.ready) {
        var targetName = transition.targetName
        if(targetName==='pipelines.index'){
          transition.targetName = "pipelines.ready";
          this.replaceWith('pipelines.ready');
        }
      }
      return false;
    }
  }
});
