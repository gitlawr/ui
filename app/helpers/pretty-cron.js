import Ember from 'ember';
// var prettyCron = require('prettycron');
import Prettycron from 'npm:prettycron';

function prettyCronHelper(param) {
  return Prettycron[param[1]](param[0]);
}
export default Ember.Helper.helper(prettyCronHelper);
