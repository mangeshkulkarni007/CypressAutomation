// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

const { _ } = Cypress;

const defaultOptions = { log: false };

Cypress.Commands.add(
  'getByTestId',
  {
    prevSubject: ['optional', 'element'],
  },
  (subject, testId, options) => {
    Cypress.log({
      displayName: 'get by data-testid',
      message: testId,
    });

    const selector = `[data-testid="${testId}"]`;

    return subject
      ? cy.wrap(subject, defaultOptions).find(selector, { ...options, ...defaultOptions })
      : cy.get(selector, { ...options, ...defaultOptions });
  },
);

Cypress.Commands.add('spinnerShouldNotExist', () => {
  cy.get('[alt="loading.."]').should('not.exist');
});

Cypress.Commands.add('waitForSpinnerToDisappear', () => {
  cy.get('[alt="loading.."]');
  cy.spinnerShouldNotExist();
});

Cypress.Commands.add('getBreadcrumbPath', () => {
  cy.spinnerShouldNotExist();

  cy.get('nav[aria-label=breadcrumb] li')
    .map('innerText')
    .then((textPath) => textPath.filter(Boolean)); // remove empty strings
});

Cypress.Commands.add('getDropdownButtonByLabel', (label) => {
  cy.contains('div[class*=MuiFormControl]:has(label)', label);
});

Cypress.Commands.overwrite('select', (originalFunction, subject, value) => {
  const isMultiselect = _.isArray(value);

  Cypress.log({
    displayName: isMultiselect ? 'select values' : 'select value',
    message: `${subject.find('label').text()}; ${value}`,
  });

  cy.wrap(subject, defaultOptions).click(defaultOptions);

  if (isMultiselect) {
    cy.get('[role=listbox] [role=option]', defaultOptions)
      .as('options', defaultOptions)
      .map('innerText', defaultOptions)
      .then((optionsText) => _.difference(value, optionsText))
      .should('be.empty', defaultOptions); // make sure that selected values are correct

    // first - check required options:
    cy.get('@options', defaultOptions)
      .filter(':not(:has(.Mui-checked))', defaultOptions)
      .should(_.noop)
      .if()
      .each(($option) => {
        const optionText = $option.text().trim();
        const $input = $option.find('input');
        const optionShouldBeSelected = _.includes(value, optionText);

        if (optionShouldBeSelected) {
          cy.wrap($input, defaultOptions).click(defaultOptions);
        }
      });

    // second - uncheck not required options:
    cy.get('@options', defaultOptions)
      .filter(':has(.Mui-checked)', defaultOptions)
      .each(($option) => {
        const optionText = $option.text().trim();
        const $input = $option.find('input');
        const optionShouldNotBeSelected = !_.includes(value, optionText);

        if (optionShouldNotBeSelected) {
          cy.wrap($input, defaultOptions).click(defaultOptions);
        }
      });

    cy.wrap(subject, defaultOptions).realClick(defaultOptions); // submit choosen options
  } else {
    cy.contains('[class*=MuiMenuItem-root]:visible', value, defaultOptions).click(defaultOptions);
  }

  return cy.wrap(subject, defaultOptions);
});

Cypress.Commands.add('dayPickerSetLastDayOfPreviousMonth', () => {
  cy.get('button[class*=MuiPickersCalendarHeader]').first().click();
  cy.wait(200); // wait for month transition
  cy.get('button[class*=MuiPickersDay-day][tabindex=0]').last().click();
  cy.contains('button', 'OK').click();
});

Cypress.Commands.add('dayPickerSetFirstDayOfCurrentMonth', () => {
  cy.get('button[class*=MuiPickersDay-day][tabindex=0]').first().click();
  cy.contains('button', 'OK').click();
});

Cypress.Commands.add('dayPickerSetFirstDayOfNextMonth', () => {
  cy.get('button[class*=MuiPickersDay-day][tabindex=0]').last().click();
  cy.contains('button', 'OK').click();
});

Cypress.Commands.add('timePickerSetTime', ({ h, m, amPm }) => {
  cy.contains('span[class*=clockNumber]', h).realClick();
  cy.wait(200); // wait for clock transition
  cy.contains('span[class*=clockNumber]', m).realClick();
  cy.contains('h6', amPm).click();
  cy.contains('button', 'OK').click();
});

Cypress.Commands.add('alertShouldBeDisplayed', (message) => {
  cy.contains('[role=dialog]', 'Alert')
    .as('alert')
    .within(() => {
      cy.contains('p[class*=MuiDialogContentText]', message).should('be.visible');
      cy.contains('button', 'OK').click();
    });
  cy.get('@alert').should('not.exist');
});

Cypress.Commands.add('paginationVerifyRowsPerPage', (rowsPerPage) => {
  cy.get('[class*=MuiTablePagination] div[class*=MuiSelect]').should('have.text', rowsPerPage);
});

Cypress.Commands.add('paginationPreviousPageButton', () => {
  cy.get('[class*=MuiTablePagination] [title="Previous page"]');
});

Cypress.Commands.add('paginationNextPageButton', () => {
  cy.get('[class*=MuiTablePagination] [title="Next page"]');
});
