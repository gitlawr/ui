import Ember from 'ember';

export default Ember.Component.extend({
  otherEnv: false,
  deployEnv: function() {
    var otherEnv = this.get('otherEnv');
    var deployEnv = otherEnv ? 'others' : 'local';
    this.set('model.deployEnv', deployEnv)
  }.observes('otherEnv'),
  init() {
    this._super();
    var endpoint = this.get('model.endpoint')
    this.set('otherEnv', endpoint ? true : false)
  }
});
