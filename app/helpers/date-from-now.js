import Ember from 'ember';

export function dateFromNow(params) {
  return moment(params[0]).fromNow()[params[1]];
}

export default Ember.Helper.helper(dateFromNow);
