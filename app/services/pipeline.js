import Ember from 'ember';
import C from 'ui/utils/constants';

export default Ember.Service.extend({
  'tab-session': Ember.inject.service(),
  store: Ember.inject.service(),
  pipelinesEndpoint: function() {
    return this.get('app.pipelinesEndpoint').replace(this.get('app.projectToken'), this.get(`tab-session.${C.TABSESSION.PROJECT}`));
  }.property(`tab-session.${C.TABSESSION.PROJECT}`,'app.pipelinesEndpoint'),


  isReady() {
    let store = this.get('store');
    return store.find('stack').then((stacks) => {
      let stack = this.filterSystemStack(stacks);
      if ( stack )
      {
        return store.rawRequest({
          url: `${this.get('pipelinesEndpoint')}`
        }).then(() => {
          console.log('isReady: true');
          return {has: true, ready: true};
        }).catch(() => {
          console.log('isReady: false');
          return {has: true, ready: false};
        });
      }

      console.log('isReady: false2');
      return {has: false, ready: false};
    }).catch(() => {
      console.log('isReady: false3');
      return Ember.RSVP.resolve({has: false, ready: false});
    });
  },
  filterSystemStack(stacks) {
    return (stacks||[]).find((stack) => {
      let info = stack.get('externalIdInfo');
      return (info.kind === C.EXTERNAL_ID.KIND_CATALOG || info.kind === C.EXTERNAL_ID.KIND_SYSTEM_CATALOG) &&
        info.base === C.EXTERNAL_ID.KIND_INFRA &&
        info.name === 'CICD';
    });
  },
});
