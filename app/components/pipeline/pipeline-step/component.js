import Ember from 'ember';

export default Ember.Component.extend({
  endpointService:    Ember.inject.service('endpoint'),
  serviceSubtitle: function(){
    var env = this.get('model.deployEnv');
    if (env === 'local') {
      return this.get('model.tag') + ' - ' + this.get('endpointService.api.display.environment.current')
    }
    return this.get('model.tag') + ' - ' + this.get('model.endpoint')
  }.property('model.deployEnv')
});
