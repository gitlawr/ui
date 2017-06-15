import Ember from 'ember';
import C from 'ui/utils/constants';

export default Ember.Service.extend({
  'tab-session': Ember.inject.service(),

  pipelinesEndpoint: function() {
    return this.get('app.pipelinesEndpoint').replace(this.get('app.projectToken'), this.get(`tab-session.${C.TABSESSION.PROJECT}`));
  }.property(`tab-session.${C.TABSESSION.PROJECT}`,'app.pipelinesEndpoint'),
});
