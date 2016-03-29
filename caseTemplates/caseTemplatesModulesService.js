    angular
        .module('openeApp.caseTemplates')
        .provider('caseTemplatesModules', caseTemplatesModulesProvider);

    function caseTemplatesModulesProvider($stateProvider, systemSettingsPagesServiceProvider) {
            
        var modules = [];
        
        this.$get = caseTemplatesModulesService;
        this.module = module;
        
        function module(m){
            modules.push(m);
            var case_type = m.caseType.replace(':', '_');
            var case_type_templates = case_type + '_templates';
            
            systemSettingsPagesServiceProvider.addModulePage(m.moduleTitleKey, 
                    'administration.systemsettings.' + case_type_templates, 'widgets');
            
            $stateProvider.state('administration.systemsettings.' + case_type_templates, {
                url: '/' + case_type_templates,
                data: {
                    authorizedRoles: []
                },
                views: {
                    'systemsetting-view': {
                        templateUrl: 'app/src/modules/caseTemplates/view/caseTemplates.html',
                        controller: m.templatesListController,
                        controllerAs: 'vm'
                    }
                }
            }).state('administration.systemsettings.' + case_type + '_template', {
                url: '/' + case_type + '_template/:storeType/:storeId/:id',
                data: {
                    authorizedRoles: []
                },
                views: {
                    'systemsetting-view': {
                        templateUrl: 'app/src/modules/caseTemplates/view/caseTemplateInfo.html',
                        controller: m.templateInfoController,
                        controllerAs: 'vm'
                    }
                }
            });
            
            
        }
        
        function caseTemplatesModulesService(){
            
        }
    }