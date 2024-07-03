'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">simple-crm documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#components-links"' :
                            'data-bs-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/AppComponent.html" data-type="entity-link" >AppComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CashflowChartComponent.html" data-type="entity-link" >CashflowChartComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ContactDetailComponent.html" data-type="entity-link" >ContactDetailComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ContactsTableComponent.html" data-type="entity-link" >ContactsTableComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DashboardComponent.html" data-type="entity-link" >DashboardComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DataProtectionComponent.html" data-type="entity-link" >DataProtectionComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DialogAddContactComponent.html" data-type="entity-link" >DialogAddContactComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DialogAddEmployeeComponent.html" data-type="entity-link" >DialogAddEmployeeComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DialogAddTransferComponent.html" data-type="entity-link" >DialogAddTransferComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DialogDeleteContactComponent.html" data-type="entity-link" >DialogDeleteContactComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DialogDeleteEmployeeComponent.html" data-type="entity-link" >DialogDeleteEmployeeComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DialogDeleteTransferComponent.html" data-type="entity-link" >DialogDeleteTransferComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DialogEditContactComponent.html" data-type="entity-link" >DialogEditContactComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DialogEditEmployeeComponent.html" data-type="entity-link" >DialogEditEmployeeComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DialogEditTransferComponent.html" data-type="entity-link" >DialogEditTransferComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EmployeeDetailComponent.html" data-type="entity-link" >EmployeeDetailComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EmployeesTableComponent.html" data-type="entity-link" >EmployeesTableComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ImprintComponent.html" data-type="entity-link" >ImprintComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/OverviewComponent.html" data-type="entity-link" >OverviewComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PieChartComponent.html" data-type="entity-link" >PieChartComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TopRevenueEmployeeComponent.html" data-type="entity-link" >TopRevenueEmployeeComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TransferDetailComponent.html" data-type="entity-link" >TransferDetailComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TransfersTableComponent.html" data-type="entity-link" >TransfersTableComponent</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/Contact.html" data-type="entity-link" >Contact</a>
                            </li>
                            <li class="link">
                                <a href="classes/Employee.html" data-type="entity-link" >Employee</a>
                            </li>
                            <li class="link">
                                <a href="classes/Transfer.html" data-type="entity-link" >Transfer</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AppTitleService.html" data-type="entity-link" >AppTitleService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CommonService.html" data-type="entity-link" >CommonService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DashboardDataService.html" data-type="entity-link" >DashboardDataService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DateService.html" data-type="entity-link" >DateService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FirestoreService.html" data-type="entity-link" >FirestoreService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/dataForEditDialog.html" data-type="entity-link" >dataForEditDialog</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MobileSort.html" data-type="entity-link" >MobileSort</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});