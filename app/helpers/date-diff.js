import Ember from 'ember';

export function dateDiff(params/*, hash*/) {
  if(!params[0]){
    return 0
  }
  return moment(params[0]).diff(params[1],params[2]);
}

export default Ember.Helper.helper(dateDiff);
