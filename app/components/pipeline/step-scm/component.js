import Ember from 'ember';
import { ajaxPromise } from 'ember-api-store/utils/ajax-promise';

export default Ember.Component.extend({
  repos:[],
  selected: null,
  selectedGitUser: null,
  statusFetching: true,
  setting: null,
  showBranch: function(){
    var modalOpts = this.get('modalOpts');
    var setting = this.get('setting');

    if(modalOpts.type === 'review'){
      return true;
    }
    if(setting&&setting.isAuth){
      return true;
    }
    return false;
  }.property('setting', 'modalOpts.type'),
  accountsInfo: function(){
    var accounts = this.get('modalOpts.accounts');
    if(!accounts){
      return [];
    }
    return accounts.map((ele)=>{
      return {
        ...ele,
        profilePicture: ele.avatar_url,
        profileUrl: ele.html_url
      }
    })
  }.property('modalOpts.accounts'),
  init(){
    this._super(...arguments);
    var modalOpts = this.get('modalOpts');
    var selectedModel = this.get('selectedModel');
    var accountsInfo = this.get('accountsInfo');
    if(modalOpts.type !== 'review'){
      this.set('statusFetching',true);
      setTimeout(()=>{
        if(selectedModel.gitUser){
          var selectedGitUser = accountsInfo.find(ele=>ele.login===selectedModel.gitUser);
          selectedGitUser&&this.set('selectedGitUser',selectedGitUser);
        }
        this.loadRepository((res)=>{
          this.set('setting',res);
          this.set('statusFetching',false);
        });
      },0);
    }else{
      this.set('statusFetching',false);
    }
  },
  selectedGitUserObserve: function(){
    var selectedGitUser = this.get('selectedGitUser');
    var pipelineStore = this.get('pipelineStore');
    this.set('selectedModel.gitUser', selectedGitUser.login);
    ajaxPromise({url:selectedGitUser.links['repos'],method:'GET',dataType:'json'}).then(res=>{
      this.set('statusFetching',false);
      if(res.xhr.status !== 200){
        return
      }
      var repos = JSON.parse(res.xhr.responseJSON)
      this.set('repos',repos);
      this.syncRepository();
    });
  }.observes('selectedGitUser'),
  loadRepository(fn1,fn2){
    var pipelineStore = this.get('pipelineStore');
    return pipelineStore.find('setting',null, {forceReload: true}).then((res)=>{
      fn1&&fn1(res);
      if(res.isAuth){
        return null
      }else{
        return null
      }
    }).then(fn2)
  },
  syncRepository(){
    var selectedModel = this.get('selectedModel');
    var repos = this.get('repos',repos);
    if(selectedModel.repository){
      var selected = repos.find((ele)=>{
        if(ele.clone_url === selectedModel.repository){
          return true;
        }
        return false;
      })
      selected&&this.set('selected', selected)||this.set('selected',null)
    }
  },
  selectedObserves: function(){
    var selected = this.get('selected');

    if(!selected){
      this.set('selectedModel.repository', '');
      return
    }
    this.set('selectedModel.repository', selected.clone_url);
  }.observes('selected','selectedModel.sourceType'),
  sourceTypeObserves: function(){
    this.syncRepository();
  }.observes('selectedModel.sourceType'),
  actions: {
    changeSCMType: function(type){
      this.set('selectedModel.sourceType',type);
    },
    reload: function(){
      this.loadRepository();
    }
  }
});
