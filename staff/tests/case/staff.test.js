var util = require('../../../test/util.js');

var loginPage = require(util.tests_base + '/login/loginPage.po.js');
var casePage = require(util.tests_base + '/cases/casePage.po.js');
var oeUtils = require(util.tests_base + '/common/utils');

describe('staff test', function() {

    var casesToDelete = [];

    beforeEach(function() {
        loginPage.login();
    });

    afterEach(function() {
        loginPage.logout();
    });
    
    //delete all created users
    afterAll(function() {
        loginPage.login(true);
        browser.waitForAngular().then(function() {
            casePage.deleteCases(casesToDelete);
            loginPage.logout(0, 0);
        });
    });

    it('should create a staff case', function() {
        console.log('should create a staff case');
        casePage.goToCasesPage();
        var createCaseBtn = element(by.id("create-case-btn"));
        createCaseBtn.click();

        browser.driver.sleep(2000);
        browser.waitForAngular().then(function() {
            element.all(by.repeater('caseType in ctrl.registeredCaseTypes')).then(function(menuitems) {
                var stdCaseTypeBtn = menuitems[1].element(by.buttonText('Staff case'));

                expect(stdCaseTypeBtn);
                stdCaseTypeBtn.click().then(function() {
                    //Fill the crud form and click create
                    var caseTitle = element(by.model('vm.case.prop_cm_title'));
                    var caseOwner = element(by.css('input[name="assoc_base_owners_added"]'));
                    var caseJournalKey = element(by.model('vm.case.prop_oe_journalKey'));//Need to be tested later
                    var caseJournalFacet = element(by.model('vm.case.prop_oe_journalFacet'));//Need to be tested later
                    var caseDescription = element(by.model('vm.case.prop_cm_description'));
                    var okDialogBtn = element(by.css('[ng-click="vm.save()"]'));
                    var cancelDialogBtn = element(by.css('[ng-click="vm.cancel()"]'));

                    browser.waitForAngular().then(function() {
                        browser.wait(protractor.ExpectedConditions.visibilityOf(caseTitle), 10000).then(function() {
                            var caseTxtTitle = oeUtils.generateRandomString(8);
                            caseTitle.sendKeys(caseTxtTitle);
                            caseOwner.clear().sendKeys("mi");
                            caseOwner.getAttribute('aria-owns').then(function(coseOwnerChoices) {
                                element.all(by.xpath('//ul[@id=\'' + coseOwnerChoices + '\']//li')).get(0).click().then(function() {});
                                caseDescription.sendKeys(oeUtils.generateRandomString(20));
                                //browser.driver.sleep(2000);
                                //browser.waitForAngular();
                                browser.wait(function() {
                                    return okDialogBtn.isEnabled().then(function(value) {
                                        return value;
                                    }); 
                                });
                                okDialogBtn.click();
                                browser.waitForAngular().then(function() {
                                    var caseId = element(by.id('caseId'));
                                    expect(caseId);
                                    caseId.getText().then(function(caseIdVal) {
                                        casesToDelete.push(caseIdVal);
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});