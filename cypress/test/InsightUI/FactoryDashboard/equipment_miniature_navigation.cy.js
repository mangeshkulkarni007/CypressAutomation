import { LoginPage, FactoryDashboard, GlobalMap } from '../../../support/pages/insightUI';

const loginPage = new LoginPage();
const globalMap = new GlobalMap();
const factoryDashboard = new FactoryDashboard();
const { sapienceAPIPassword, sapienceAPIUser } = Cypress.env();

describe('CFIP-31784 - Equipment Miniature Navigation', () => {
  beforeEach(() => {
    loginPage.login(sapienceAPIUser, sapienceAPIPassword);
    globalMap.visit();
    globalMap.goToFactory('MangeshFactory');
  });

  it('CFIP-31918 - Verify equipment miniatures on each line card on FCP card', () => {
    // miniature visible:
    factoryDashboard.locators.miniaturesByLineName('Non-continuous Line-1').should('be.visible');
    factoryDashboard.locators.miniaturesByLineName('mkline').should('be.visible');

    // miniature not exists:
    factoryDashboard.locators.miniaturesByLineName('testline4').should('not.exist');
  });

  it('CFIP-31924 - Verify slider when equipment exceeds available space', () => {
    // slider visible:
    factoryDashboard.locators.miniaturesSliderByLineName('Non-continuous Line-1').should('be.visible');

    // slider not exists:
    factoryDashboard.locators.miniaturesSliderByLineName('mkline').should('not.exist');
  });

  it('CFIP-31919 - Verify total count of equipment per line with equipment miniatures and count indicator', () => {
    const factoryLines = [
      { name: 'Non-continuous Line-1', equipmentCount: 11 },
      { name: 'mkline', equipmentCount: 7 },
    ];

    factoryLines.forEach(({ name, equipmentCount }) => {
      factoryDashboard.locators
        .miniaturesByLineName(name)
        .should('be.visible')
        .getByTestId('miniature')
        .should('be.visible')
        .should('have.length', equipmentCount)
        .each(($equipment, index) => {
          const countIndicator = $equipment.text().trim();
          expect(countIndicator, `${name} equipment number ${index + 1} `).to.eq(`${index + 1}`);
        });
    });
  });

  it('CFIP-32185 - Verify the cursor change to hand-pointer', () => {
    const factoryLines = [
      { name: 'Non-continuous Line-1', miniatureCursor: 'pointer' },
      { name: 'mkline', miniatureCursor: 'auto' },
    ];

    factoryLines.forEach((factoryLine) => {
      factoryDashboard.locators
        .miniaturesByLineName(factoryLine.name)
        .should('be.visible')
        .find('div')
        .first()
        .should('have.css', 'cursor', factoryLine.miniatureCursor);
    });
  });

  it('CFIP-31920 CFIP-32186 - Verify the interaction with slider functionality for equipment selection', () => {
    const lineName = 'Non-continuous Line-1';
    const equipmentFirst = 'EQP5010';
    const equipmentLast = 'eqp5011';

    const almostZeroPx = /^-?0(\.\d+)?px$/;
    const muchMoreThanZeroPx = /^\d+\.\d+px$/;

    const assertSliderPositionIsToTheLeft = ($slider) => {
      expect($slider.css('left')).to.match(almostZeroPx);
      expect($slider.css('right')).to.match(muchMoreThanZeroPx);
    };
    const assertSliderPositionIsToTheRight = ($slider) => {
      expect($slider.css('left')).to.match(muchMoreThanZeroPx);
      expect($slider.css('right')).to.match(almostZeroPx);
    };

    // slider is on the left side by default:
    factoryDashboard.locators.miniaturesSliderByLineName(lineName).should(assertSliderPositionIsToTheLeft);
    factoryDashboard.locators.equipmentByLineName(lineName, equipmentFirst).should('be.visible');
    factoryDashboard.locators.equipmentByLineName(lineName, equipmentLast).should('not.be.visible');

    // click on the right side:
    factoryDashboard.locators.miniaturesByLineName(lineName).click('right');
    factoryDashboard.locators.miniaturesSliderByLineName(lineName).should(assertSliderPositionIsToTheRight);
    factoryDashboard.locators.equipmentByLineName(lineName, equipmentFirst).should('not.be.visible');
    factoryDashboard.locators.equipmentByLineName(lineName, equipmentLast).should('be.visible');

    // drag the slider to the left:
    factoryDashboard.locators
      .miniaturesSliderByLineName(lineName)
      .trigger('mousedown')
      .trigger('mousemove', { x: 10, y: 10 }, { force: true })
      .trigger('mousemove', { x: 10, y: 10 }, { force: true })
      .trigger('mousemove', { x: 10, y: 10 }, { force: true })
      .trigger('mouseup');
    factoryDashboard.locators.miniaturesSliderByLineName(lineName).should(assertSliderPositionIsToTheLeft);
    factoryDashboard.locators.equipmentByLineName(lineName, equipmentFirst).should('be.visible');
    factoryDashboard.locators.equipmentByLineName(lineName, equipmentLast).should('not.be.visible');
  });
});
