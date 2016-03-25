var util = require('../../../test/util.js');

var loginPage = require(util.tests_base + '/login/loginPage.po.js');
var casesPage = require(util.tests_base + '/cases/casePage.po.js');
var oeUtils = require(util.tests_base + '/common/utils');

describe('staff test', function(){
    
    beforeEach(function () {
        loginPage.login();
    });
    
    afterEach(function () {
        loginPage.logout();
    });
    
    it('staff case testing', function(){
        casesPage.goToCasesPage();
        var createCaseBtn = element(by.id("create-case-btn"));
        createCaseBtn.click();
        element.all(by.repeater('caseType in ctrl.registeredCaseTypes')).then(function(menuitems) {
            var stdCaseTypeBtn = menuitems[1].element(by.buttonText('Staff case'));
            expect(stdCaseTypeBtn);
            stdCaseTypeBtn.click().then(function () {
                //Fill the crud form and click create
                var caseTitle = element(by.model('vm.case.prop_cm_title'));
                var caseOwner = element(by.model('vm.case.assoc_base_owners_added'));
                var caseJournalKey = element(by.model('vm.case.prop_oe_journalKey'));//Need to be tested later
                var caseJournalFacet = element(by.model('vm.case.prop_oe_journalFacet'));//Need to be tested later
                var caseDescription = element(by.model('vm.case.prop_cm_description'));
                var okDialogBtn = element(by.css('[ng-click="vm.save()"]'));
                var cancelDialogBtn = element(by.css('[ng-click="vm.cancel()"]'));

                browser.waitForAngular().then(function(){
                    browser.wait(protractor.ExpectedConditions.visibilityOf(caseTitle), 10000).then(function(){
                        var caseTxtTitle = oeUtils.generateRandomString(8);
                        caseTitle.sendKeys(caseTxtTitle);
                        caseOwner.sendKeys("la");
                        caseDescription.sendKeys(oeUtils.generateRandomString(20));
                        //browser.driver.sleep(2000);
                        //browser.waitForAngular();
                        browser.wait(function () {
                            return okDialogBtn.isEnabled().then(function (value) {
                                return value;
                            }); 
                        });
                        okDialogBtn.click();
                        browser.waitForAngular().then(function(){
                            browser.driver.sleep(2000);
                            //TODO fix assertion
                            //expect(element(by.xpath('//h1')).getText().toEqual(caseTxtTitle));
                        });
                    });
                });

            });
        });
    });
    
});