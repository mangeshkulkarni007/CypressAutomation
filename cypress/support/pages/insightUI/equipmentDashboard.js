import BasePage from '../base';

const { _, $, env } = Cypress;

export default class EquipmentDashboard extends BasePage {
  constructor() {
    super('/insight-ui/factory-dashboard', {
      details: () => cy.get('[class*=MuiCardContent]').first(),
      equipmentUtilization: () => cy.getByTestId('equipment-utilization'),
      timeRangeButton: () => cy.get('main button'),
      customTimeModal: () => cy.contains('[role=dialog]:visible', 'Custom Time'),
      donutChart: () => cy.get('g.recharts-pie'),
      donutChartSectors: () => this.locators.donutChart().find('g.recharts-pie-sector > path'),
      tooltip: () => cy.get('.recharts-tooltip-wrapper:visible'),
      equipmentShiftUtilization: () => cy.getByTestId('equipment-utilization-bars'),
      bars: () => this.locators.equipmentShiftUtilization().find('.recharts-bar-rectangle'),
    });
  }

  checkUrlOfEquipmentDetail(factoryName, lineName) {
    cy.location('pathname').should('match', /^\/insight-ui\/insight-dashboard\/.*$/);
    cy.getBreadcrumbPath().should('deep.eq', [factoryName, lineName]);
  }

  checkPrimaryEquipmentDetails({ name, model, supplier }) {
    this.locators
      .details()
      .find('h6')
      .should('have.text', name)
      .next('p')
      .should('have.text', `Model: ${model}`)
      .next('p')
      .should('have.text', `Supplier: ${supplier}`);
  }

  checkEquipmentDetailsStructure() {
    this.locators.details().within(() => {
      cy.get('[alt="Equipment Avatar"]').should('be.visible');
      cy.get('h6').should('be.visible'); // primary details
      cy.get('ul')
        .should('have.length', 2)
        .first() //equipment state
        .should('be.visible')
        .next() // connection status
        .should('be.visible');
    });
  }

  checkEquipmentState(data) {
    const timeIconColors = {
      'productive time': 'rgb(0, 153, 34)', // green
      'standby time': 'rgb(251, 192, 45)', // yellow
      'engineering time': 'rgb(66, 165, 245)', // blue
      'scheduled downtime': 'rgb(239, 154, 154)', // light red
      'unscheduled downtime': 'rgb(244, 67, 54)', // red
      'non-scheduled time': 'rgb(189, 189, 189)', // grey
      'unknown time': 'rgb(0, 0, 0)', // black
    };

    this.locators
      .details()
      .contains('span', 'Equipment State')
      .parentsUntil('ul')
      .then(_.last)
      .should('be.visible')
      .within(() => {
        cy.get('.text-bold')
          .invoke('text')
          .invoke('toUpperCase')
          .should((state) => {
            expect(state).not.to.be.empty;

            if (data) {
              expect(state).to.eq(data);
            }
          });
        cy.get('[class^=MuiAvatar] > div')
          .invoke('css', 'background-color')
          .should((backgroundColor) => {
            expect(backgroundColor).not.to.be.empty;

            if (data) {
              expect(backgroundColor).to.eq(timeIconColors[data.toLowerCase()]);
            }
          });
      });
  }

  checkConnectionStatus(status) {
    const plugIconColors = {
      connected: 'rgb(0, 153, 34)',
      disconnected: 'rgb(225, 37, 27)',
      disabled: 'rgb(126, 126, 120)',
    };

    this.locators
      .details()
      .contains('span', 'Connection Status')
      .parentsUntil('ul')
      .then(_.last)
      .should('be.visible')
      .within(() => {
        cy.get('.text-bold').invoke('text').invoke('toUpperCase').should('eq', status);
        cy.get('[class^=MuiAvatar] > div').should('have.css', 'background-color', plugIconColors[status.toLowerCase()]);
      });
  }

  checkDonutChart(equipmentUtilizationData, otherData) {
    this.locators.donutChart().as('donutChart').should('be.visible');

    if (equipmentUtilizationData) {
      cy.get('@donutChart').prev().should('have.text', `${equipmentUtilizationData}%`);
    }

    if (otherData) {
      this.locators.tooltip().should('not.exist');
      this.locators.donutChartSectors().last().trigger('mouseover');
      this.locators
        .tooltip()
        .should('be.visible')
        .within(() => {
          cy.contains('p', 'Unknown Time')
            .next()
            .should('have.text', `${otherData.unknown.percent}%`)
            .next()
            .should('have.text', otherData.unknown.time);
        });
    }
  }

  checkEquipmentUtilization(data) {
    this.locators
      .equipmentUtilization()
      .contains('h3', 'Equipment Utilization')
      .as('equipmentUtilization')
      .should('be.visible');

    if (data) {
      cy.get('@equipmentUtilization').should('have.text', `Equipment Utilization ${data}%`);
    }
  }

  #checkListItemData($listItem, { percent, time }) {
    cy.wrap($listItem)
      .find('strong')
      .should('have.text', percent ? `${percent}%` : '')
      .next('p')
      .should('have.text', time);
  }

  checkEquipmentUtilizationUptime(data) {
    this.locators
      .equipmentUtilization()
      .contains('h4', 'Uptime')
      .next()
      .within(() => {
        cy.contains('li', 'Productive Time').as('productiveTime').should('be.visible');
        cy.contains('li', 'Standby Time').as('standbyTime').should('be.visible');
        cy.contains('li', 'Engineering Time').as('engineeringTime').should('be.visible');
        cy.contains('li', 'Manufacturing Time').as('manufacturingTime').should('be.visible');
      });

    if (data) {
      cy.get('@productiveTime').then(($productive) => this.#checkListItemData($productive, data.productive));
      cy.get('@standbyTime').then(($standby) => this.#checkListItemData($standby, data.standby));
      cy.get('@engineeringTime').then(($engineering) => this.#checkListItemData($engineering, data.engineering));
      cy.get('@manufacturingTime').then(($manufacturing) =>
        this.#checkListItemData($manufacturing, data.manufacturing),
      );
    }
  }

  checkEquipmentUtilizationDowntime(data) {
    this.locators
      .equipmentUtilization()
      .contains('h4', 'Downtime')
      .next()
      .within(() => {
        cy.contains('li', 'Scheduled Downtime').as('scheduledDowntime').should('be.visible');
        cy.contains('li', 'Unscheduled Downtime').as('unscheduledDowntime').should('be.visible');
      });

    if (data) {
      cy.get('@scheduledDowntime').then(($scheduled) => this.#checkListItemData($scheduled, data.scheduled));
      cy.get('@unscheduledDowntime').then(($unscheduled) => this.#checkListItemData($unscheduled, data.unscheduled));
    }
  }

  checkEquipmentUtilizationOtherTime(dataOther, dataTotal) {
    this.locators
      .equipmentUtilization()
      .contains('h4', 'Other')
      .next()
      .within(() => {
        cy.contains('li', 'Non-Scheduled Time').as('nonScheduled').should('be.visible');
        cy.contains('li', 'Unknown Time').as('unknown').should('be.visible');
        cy.contains('li', 'Total Time').as('total').should('be.visible');
      });

    if (dataOther) {
      cy.get('@nonScheduled').then(($nonScheduled) => this.#checkListItemData($nonScheduled, dataOther.nonScheduled));
      cy.get('@unknown').then(($unknown) => this.#checkListItemData($unknown, dataOther.unknown));
    }
    if (dataTotal) {
      cy.get('@total').find('strong').should('have.text', dataTotal);
    }
  }

  waitForEquipmentStateAndStubResponse(state) {
    cy.intercept('/insight/equipmentState/**', (req) => {
      req.reply((res) => {
        res.body.state = state;
      });
    });
  }

  waitForMetricDataPollingAndStubResponse() {
    cy.intercept('/insight/metrics/metricData**', { fixture: 'equipmentDashboard/metricDataResponse.json' }).as(
      'getMetricData',
    );

    cy.wait('@getMetricData', { timeout: 11_000 });
  }

  waitForTimeSeriesPollingAndStubResponse() {
    cy.intercept('/insight/metrics/timeSeries**', { fixture: 'equipmentDashboard/timeSeriesResponse.json' }).as(
      'getTimeSeries',
    );

    cy.wait('@getTimeSeries', { timeout: 11_000 });
  }

  checkTableDataIntegrity() {
    this.locators.equipmentUtilization().within(() => {
      cy.contains('No data').as('noData').should('be.visible');
      cy.get('@noData').should('not.exist');

      cy.get('li:has([class*=MuiListItemIcon]) strong:visible') // percentage displayed
        .should('have.length.above', 1)
        .map('innerText')
        .mapInvoke('replace', '%', '')
        .map(Number)
        .then(_.sum)
        .then((float) => _.round(float, 1))
        .should('be.closeTo', 100, 0.1);
    });
  }

  checkEquipmentUtilizationBarChart(title, chartColumnsCount, data) {
    const barsColors = [
      'rgb(66, 165, 245)', // blue
      'rgb(239, 154, 154)', // light red
      'rgb(189, 189, 189)', // grey
      'rgb(76, 175, 80)', // green
      'rgb(255, 214, 0)', // yellow
      'rgb(244, 67, 54)', // red
      'rgb(0, 0, 0)', // black
    ];

    this.locators.equipmentShiftUtilization().find('h3').should('be.visible').should('have.text', title);
    this.locators
      .bars()
      .should('be.visible')
      .should(({ length }) => {
        if (chartColumnsCount) {
          expect(length / barsColors.length).to.eq(chartColumnsCount);
        } else {
          expect(length / barsColors.length).to.be.above(0);
        }
      });

    if (data) {
      const timeScaleLabels = data.timeScaleLabels[env('ci') ? 'ci' : 'local'];

      this.locators
        .equipmentShiftUtilization()
        .find('g.xAxis tspan') // time scale
        .should('be.visible')
        .map($)
        .mapInvoke('text')
        .should('deep.eq', timeScaleLabels);

      cy.get('.recharts-bar-rectangles:has("path")')
        .map(($rectangle) => $($rectangle).find('g > path').first().css('fill'))
        .should('deep.equal', barsColors);

      this.locators.tooltip().should('not.exist');
      this.locators.bars().filter(':visible').first().trigger('mouseover');
      this.locators
        .tooltip()
        .should('be.visible')
        .within(() => {
          const tooltipPercentAndTimeFormat = ({ percent, time }) => `${percent.toFixed(1)}% ${time}`;

          cy.contains('p', `${data.date} ${timeScaleLabels[0]}`)
            .next()
            .should('have.text', `Non-Scheduled Time: ${tooltipPercentAndTimeFormat(data.nonScheduled)}`)
            .next()
            .should('have.text', `Unscheduled Downtime: ${tooltipPercentAndTimeFormat(data.unscheduled)}`)
            .next()
            .should('have.text', `Scheduled Downtime: ${tooltipPercentAndTimeFormat(data.scheduled)}`)
            .next()
            .should('have.text', `Standby Time: ${tooltipPercentAndTimeFormat(data.standby)}`)
            .next()
            .should('have.text', `Unknown Time: ${tooltipPercentAndTimeFormat(data.unknown)}`)
            .next()
            .should('have.text', `Engineering Time: ${tooltipPercentAndTimeFormat(data.engineering)}`)
            .next()
            .should('have.text', `Productive Time: ${tooltipPercentAndTimeFormat(data.productive)}`);
        });
    }
  }

  selectTimeRange(range) {
    this.locators.timeRangeButton().select(range);
  }

  #goToAbsoluteTimeInModal() {
    this.locators.customTimeModal().should('be.visible');
    cy.contains('button', 'Absolute').click();
    cy.contains('button', 'Apply').should('be.disabled');
    cy.get('input#startDate').invoke('val').should('be.empty');
    cy.get('input#startTime').invoke('val').should('be.empty');
    cy.get('input#endDate').invoke('val').should('not.be.empty');
    cy.get('input#endTime').invoke('val').should('not.be.empty');
  }

  #goToRelativeTimeInModal() {
    this.locators.customTimeModal().should('be.visible');
    cy.contains('button', 'Relative').click();
    cy.contains('button', 'Apply').should('be.enabled');
    cy.get('input[name=interval]').invoke('val').should('eq', '15');
    cy.get('#mui-component-select-duration').should('have.text', 'Minutes Ago');
  }

  #applyCustomTime() {
    cy.contains('button', 'Apply').click();
    this.locators.customTimeModal().should('not.exist');
  }

  selectAbsoluteTime() {
    this.#goToAbsoluteTimeInModal();

    cy.get('input#startDate').next().find('button').click();
    cy.dayPickerSetLastDayOfPreviousMonth();

    cy.get('input#startTime').next().find('button').click();
    cy.timePickerSetTime({ h: 10, m: 30, amPm: 'AM' });

    cy.get('input#endDate').next().find('button').click();
    cy.dayPickerSetFirstDayOfCurrentMonth();

    cy.get('input#endTime').next().find('button').click();
    cy.timePickerSetTime({ h: 10, m: 30, amPm: 'PM' });

    this.#applyCustomTime();
  }

  selectAbsoluteTimeInFuture() {
    this.#goToAbsoluteTimeInModal();

    cy.get('input#startDate').next().find('button').click();
    cy.dayPickerSetFirstDayOfCurrentMonth();

    cy.get('input#startTime').next().find('button').click();
    cy.timePickerSetTime({ h: 10, m: 30, amPm: 'AM' });

    cy.get('input#endDate').next().find('button').click();
    cy.dayPickerSetFirstDayOfNextMonth();

    this.#applyCustomTime();
  }

  selectAbsoluteStartTimeAfterEndTime() {
    this.#goToAbsoluteTimeInModal();

    cy.get('input#startDate').next().find('button').click();
    cy.dayPickerSetFirstDayOfCurrentMonth();

    cy.get('input#startTime').next().find('button').click();
    cy.timePickerSetTime({ h: 10, m: 30, amPm: 'AM' });

    cy.get('input#endDate').next().find('button').click();
    cy.dayPickerSetLastDayOfPreviousMonth();

    this.#applyCustomTime();
  }

  selectRelativeTime({ interval, durationType }) {
    this.#goToRelativeTimeInModal();

    cy.get('input[name=interval]').clear().type(interval);
    cy.get('#mui-component-select-duration').select(`${durationType} Ago`);

    this.#applyCustomTime();
  }

  checkFutureDateWarningDialog() {
    cy.alertShouldBeDisplayed('Select Past or current date-time as Start & End date-time');
    this.locators.customTimeModal().should('not.exist');
    this.locators.timeRangeButton().should('have.text', 'Current Shift');
  }

  checkStartDateAfterEndDateWarningDialog() {
    cy.alertShouldBeDisplayed('Select End date-time to be after Start date-time.');
    this.locators.customTimeModal().should('not.exist');
    this.locators.timeRangeButton().should('have.text', 'Current Shift');
  }
}
