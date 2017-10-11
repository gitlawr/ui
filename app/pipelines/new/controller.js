import Ember from 'ember';
import FilterState from 'ui/mixins/filter-state';

const showKinds = ['user','admin'];

export default Ember.Controller.extend(FilterState, {
  access: Ember.inject.service(),
  sortBy: 'name',
  headers: Ember.computed('isLocal', function() {
    let out = [
      {
        translationKey: 'generic.state',
        name: 'state',
        sort: ['state'],
        width: '125'
      },
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

    if ( this.get('isLocal') ) {
      out.push({
        translationKey: 'accountsPage.index.table.username',
        name: 'username',
        sort: ['username'],
      });
    }

    out.push({
      translationKey: 'accountsPage.index.table.identity',
      name: 'name',
      sort: ['name'],
    });

    return out;
  }),
  filterableContent: Ember.computed.alias('model.userList'),
  filteredByKind: function() {
    return this.get('filtered').filter((row) => {
      var kind = (row.get('kind')||'').toLowerCase();
      return showKinds.indexOf(kind) !== -1;
    });
  }.property('filtered.@each.kind'),

  isLocal: function() {
    return this.get('access.provider') === 'localauthconfig';
  }.property('access.provider'),

  actions: {
    done() {
      this.send('goToPrevious','containers.index');
    },

    cancel() {
      this.send('goToPrevious');
    },
  }
});
