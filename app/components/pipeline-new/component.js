import Ember from 'ember';

export default Ember.Component.extend({
  approverHeaders: function() {
    let out = [
      {
        translationKey: 'generic.id',
        name: 'id',
        sort: ['id'],
        width: '120'
      },
      {
        translationKey: 'accountsPage.index.table.kind',
        name: 'kind',
        sort: ['kind'],
        width: '120'
      },
    ];
    out.push({
      translationKey: 'accountsPage.index.table.username',
      name: 'username',
      sort: ['username'],
    });

    out.push({
      translationKey: 'accountsPage.index.table.identity',
      name: 'name',
      sort: ['name'],
    });

    return out;
  }.property(),
  approvers: [],
  init() {
    this._super(...arguments);
  },
  
  actions: {
    save: function(success) {
      success(true)
      return false
    },
    cancel: function() {
      // TODO: set default done() go back to pipelines.index.active
      this.done();
    }
  }
});
