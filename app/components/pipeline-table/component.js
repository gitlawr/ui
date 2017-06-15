import Ember from 'ember';

export const headersAll =  [
  {
    name: 'name',
    sort: ['name'],
    searchField: 'name',
    translationKey: 'generic.pipelineName',
  },
  {
    name: 'repository',
    sort: ['repository'],
    searchField: 'repository',
    translationKey: 'generic.repository',
  },
  {
    name: 'branch',
    sort: ['branch'],
    searchField: 'branch',
    translationKey: 'generic.branch',
  },
  {
    name: 'status',
    sort: ['status'],
    width: 100,
    searchField: 'status',
    translationKey: 'pipelinesPage.table.status',
  },
];

export default Ember.Component.extend({
  prefs: Ember.inject.service(),

  stickyHeader: true,

  sortBy: 'name',

  headers: function() {
    return headersAll;
  }.property(),

  filtered: function() {
    let out = this.get('body')||[];
    return out;
  }.property(),
});
