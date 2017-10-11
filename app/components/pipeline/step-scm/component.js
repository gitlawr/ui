import Ember from 'ember';

export default Ember.Component.extend({
  repos:[],
  selected: null,
  statusFetching: true,
  setting: null,
  init(){
    this._super(...arguments);
    var selectedModel = this.get('selectedModel');
    this.set('statusFetching',true);
    this.loadRepository((res)=>{
      this.set('setting',res);
    },(res)=>{
      this.set('statusFetching',false);
      if(!res){
        return
      }
      var repos = JSON.parse(res)
      this.set('repos',repos.filter(repo=>repo.permissions.admin));
      this.syncRepository();
    });
  },
  loadRepository(fn1,fn2){
    var pipelineStore = this.get('pipelineStore');
    return pipelineStore.find('setting',null, {forceReload: true}).then((res)=>{
      fn1(res);
      if(res.isAuth){
        return res.doAction('getrepos');
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
