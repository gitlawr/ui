import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    var store = this.get('store');
    var model = store.find('pipeline', null, {url: `pipelines/${params.pipeline_id}`, forceReload: true, filter: {all: 'false'}});
    return model.then(function(res){
      return Ember.Object.create({
          pipeline: res,
          activities: res.activities,
        });
    });
  },
});

// import Ember from 'ember';
// import C from 'ui/utils/constants';
// import { parseExternalId } from 'ui/utils/parse-externalid';

// export default Ember.Route.extend({
//   catalog: Ember.inject.service(),

//   model() {
//     return this.get('store').find('stack').then((stacks) => {
//       let deps = [];
//       let catalog = this.get('catalog');
//       stacks = stacks.filterBy('isFromCatalog', true);

//       stacks.forEach((stack) => {
//         let extInfo = parseExternalId(stack.get('externalId'));
//         deps.push(catalog.fetchTemplate(extInfo.templateId, false));
//       });

//       return Ember.RSVP.all(deps).then((templates) => {
//         templates.forEach((template) => {
//           stacks.filterBy('externalIdInfo.templateId', template.id).forEach((stack) => {
//             Ember.set(stack,'catalogTemplateInfo',template);
//           });
//         });

//         return Ember.Object.create({
//           stacks: stacks,
//         });
//       });
//     });
//   },

//   setDefaultRoute: Ember.on('activate', function() {
//     this.set(`session.${C.SESSION.CONTAINER_ROUTE}`,'containers');
//   }),
// });
