import Ember from 'ember';
import { ajaxPromise } from 'ember-api-store/utils/ajax-promise';

export default Ember.Controller.extend({
  queryParams: [/*'code', 'state',*/ 'login'],
  code: '',
  state: '',
  login: false,
  init(){
    this._super(...arguments);
    var pipelineStore = this.get('pipelineStore');
    var login = this.get('login');
    // debugger
    // if(login){
      debugger
      ajaxPromise({
        url:/*pipelineStore.baseUrl+*/'http://localhost:8000/r/projects/1a5/pipeline-server:60080/v1/github/login',
        method: 'POST',
        header:{
          
        },
        dataType: 'json' 
      }).then(()=>{

      })
    // }
  }
});
