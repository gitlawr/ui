import Ember from 'ember';

export const headersAll =  [
  {
    name: 'name',
    sort: ['name'],
    searchField: 'name',
    label: 'Name'
  },
  {
    name: 'activity',
    sort: ['activity'],
    width: '200px',
    searchField: 'activity',
    label: 'Latest Activity'
  },
  {
    name: 'webhookToken',
    sort: ['webhookToken'],
    searchField: 'webhook',
    label: 'Webhook Secret'
  },
  {
    name: 'isActivate',
    sort: ['isActivate'],
    searchField: 'isActivate',
    label: 'Status'
  }
];

export default Ember.Component.extend({
  prefs: Ember.inject.service(),

  stickyHeader: true,

  sortBy: 'name',

  headers: function() {
    return headersAll;
  }.property(),
});
