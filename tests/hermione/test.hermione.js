require('dotenv').config();
const assert = require('assert');
const axiosInstance = require('../../server/utils/axiosInstance');

const testedConf = {
  repoName: 'georgiylityagin/repo-for-testing-CI',
  buildCommand: 'npm run build',
  mainBranch: 'master',
  period: '15',
  commitHash: 'e6946e6c9ac66ec96e321debc093bae9308029fa'
}


describe('Проверка работы стартовой страницы', function() {
  beforeEach(async function() {
    await axiosInstance.delete('/conf');
    await this.browser.pause(500);
  })

  it('Если настройки не заданы, по корневому адресу должна открываться Start Page', function() {
    return this.browser
      .url('/')
      .pause(1000)
      .waitForExist('#startPage')
      .then((exists) => {
        assert.ok(exists, 'Стартовая страница не открылась');
      })
      .assertView('startPage', 'body', { screenshotDelay: 10 })
  })

  it('Можно перейти со стартовой страницы к настройкам по кнопке "Open settings"', function() {
    return this.browser
      .url('/')
      .waitForExist('#startPage')
      .pause(500)
      .click('#toSettings1')
      .pause(500)
      .isExisting('#settingsPage')
      .then((exists) => {
        assert.ok(exists, 'Не удалось перейти по ссылке к настройкам');
      })
      .assertView('settingsPage', 'body', { screenshotDelay: 10 })
  });

  it('Можно перейти со стартовой страницы к настройкам по кнопке "settings" в header', function() {
    return this.browser
    .url('/')
    .waitForExist('#startPage')
    .pause(500)
    .click('#toSettings2')
    .pause(500)
    .isExisting('#settingsPage')
    .then((exists) => {
      assert.ok(exists, 'Не удалось перейти по ссылке к настройкам');
    })
    .assertView('settingsPage', 'body', { screenshotDelay: 10 })
  });

});


describe('Проверка работы страницы settings', function() {

  beforeEach(async function() {
    await axiosInstance.delete('/conf');
    await this.browser.pause(500);
  })

  it('Можно перейти на страницу настроек по адресу "/settings"', function() {
    return this.browser
      .url('settings')
      .waitForExist('body')
      .isExisting('#settingsPage')
      .then((exists) => {
        assert.ok(exists, 'Страница настроек не открылась');
      })
      .assertView('settingsPage', 'body', { screenshotDelay: 10 })
  })

  it('Eсли не заполнено поле repo-name, кнопка Save в состоянии disabled', function () {
    return this.browser
      .url('settings')
      .waitForExist('#settingsPage')
      .click('#build')
      .keys([testedConf.buildCommand])
      .click('#branch')
      .keys([testedConf.mainBranch])
      .click('#period')
      .keys([testedConf.period])
      .isExisting('#save[disabled]')
      .then((exists) => {
        assert.ok(exists, 'Кнопка должна быть в состоянии disabled');
      })
      .assertView('disabledBtn', '#save', { screenshotDelay: 10 })
  })

  it('Eсли не заполнено поле build command, кнопка Save в состоянии disable', function () {
    return this.browser
      .url('settings')
      .waitForExist('#settingsPage')
      .click('#repository')
      .keys([testedConf.repoName])
      .click('#branch')
      .keys([testedConf.mainBranch])
      .click('#period')
      .keys([testedConf.period])
      .isExisting('#save[disabled]')
      .then((exists) => {
        assert.ok(exists, 'Кнопка должна быть в состоянии disabled');
      })
      .assertView('disabledBtn', '#save', { screenshotDelay: 10 })
  })

  it('Eсли период не является числом, кнопка Save в состоянии disable', function () {
    return this.browser
      .url('settings')
      .waitForExist('#settingsPage')
      .click('#repository')
      .keys([testedConf.repoName])
      .click('#build')
      .keys([testedConf.buildCommand])
      .click('#branch')
      .keys([testedConf.mainBranch])
      .click('#period')
      .keys(['text'])
      .click('body')
      .pause(100)
      .isExisting('#save[disabled]')
      .then((exists) => {
        assert.ok(exists, 'Кнопка должна быть в состоянии disabled');
      })
      .assertView('disabledBtn', '#save', { screenshotDelay: 10 })
  })

  it('При попытке сохранить в настройках несуществующий репозиторий вылезет сообщение об ошибке', function() {
    return this.browser
      .url('settings')
      .waitForExist('#settingsPage')
      .click('#repository')
      .keys(['notexistingaccount/undefined-null'])
      .click('#build')
      .keys([testedConf.buildCommand])
      .click('#branch')
      .keys([testedConf.mainBranch])
      .click('#period')
      .keys([testedConf.period])
      .click('#save')
      .waitForExist('#alert')
      .isExisting('#alert')
      .then((exists) => {
        assert.ok(exists, 'Сообщение об ошибке не появилось');
      })
      .assertView('errorMessage', '#alert', { screenshotDelay: 10 })
  })

  it('После сохранения настроек выполняется переход на страницу history', function() {
    return this.browser
      .url('settings')
      .waitForExist('#settingsPage')
      .click('#repository')
      .keys([testedConf.repoName])
      .click('#build')
      .keys([testedConf.buildCommand])
      .click('#branch')
      .keys([testedConf.mainBranch])
      .click('#period')
      .keys(['0'])
      .click('#save')
      .waitForExist('#historyPage')
      .pause(500)
      .isExisting('#historyPage')
      .then((exists) => {
        assert.ok(exists, 'Не произошло перехода на страницу history');
      })
      .assertView('historyPage', 'body', { screenshotDelay: 10 })
  })
})


describe('Проверка работы страницы history', function() {

  beforeEach(async function() {
    await axiosInstance.delete('/conf');
    await this.browser
      .url('settings')
      .waitForExist('#settingsPage')
      .click('#repository')
      .keys([testedConf.repoName])
      .click('#build')
      .keys([testedConf.buildCommand])
      .click('#branch')
      .keys([testedConf.mainBranch])
      .click('#period')
      .keys(['0'])
      .click('#save')
      .pause(500)
      .waitForExist('#historyPage');
  })

 
  it('Если настройки заданы, по корневому адресу должна открываться History Page', function() {
    return this.browser
      .url('/')
      .waitForExist('#historyPage')
      .pause(1000)
      .isExisting('#historyPage')
      .then((exists) => {
        assert.ok(exists, 'History Page не открылась');
      })
      .assertView('historyPage', 'body', { screenshotDelay: 10 })
  })

  it('Можно перейти со страницы history к настройкам по кнопке "settings" в header', function() {
    return this.browser
      .url('/')
      .waitForExist('#historyPage')
      .click('#toSettings')
      .isExisting('#settingsPage')
      .then((exists) => {
        assert.ok(exists, 'Не удалось перейти по ссылке к настройкам');
      })
      .assertView('settingsPage', 'body', { screenshotDelay: 10 })
  })

  it('На странице history в качестве заголовка отображается название репозитория', function() {
    return this.browser
      .url('/')
      .waitForExist('#historyPage')
      .pause(1000)
      .getText('#reponame')
      .then((title) => {
        assert.equal(title, testedConf.repoName, 'Неправильный заголовок')
      })
  })

  it('При нажатии на кнопку Run build появляется всплывающее окно с инпутом', function() {
    return this.browser
      .url('/')
      .waitForExist('#historyPage')
      .pause(500)
      .click('#runBuild')
      .pause(100)
      .isExisting('#popUp')
      .then((exists) => {
        assert.ok(exists, 'Не открылось всплывающее окно');
      })
      .assertView('popUp', '#popUp', { screenshotDelay: 10 })
  })

  it('После отправки коммита на сборку через форму во всплывающем окне откроется страница с деталями билда', function() {
    return this.browser
      .url('/')
      .waitForExist('#historyPage')
      .pause(500)
      .click('#runBuild')
      .pause(100)
      .click('#commitHash')
      .keys([testedConf.commitHash])
      .click('#save')
      .waitForExist('#detailsPage')
      .pause(500)
      .isExisting('#detailsPage')
      .then((exists) => {
        assert.ok(exists, 'Не произошёл переход на страницу нового билда');
      })
      .assertView('detailsPage', '#detailsPage', { screenshotDelay: 10 })
  })

  it('По клику на карточку билда происходит переход на страницу с деталями билда', function() {
    return this.browser
      .url('/')
      .waitForExist('#historyPage')
      .pause(500)
      .click('#runBuild')
      .pause(100)
      .click('#commitHash')
      .keys([testedConf.commitHash])
      .click('#save')
      .waitForExist('#detailsPage')
      .click('#reponame')
      .waitForExist('#historyPage')
      .pause(1000)
      .click('#buildList:first-child')
      .waitForExist('#detailsPage')
      .isExisting('#detailsPage')
      .then((exists) => {
        assert.ok(exists, 'Не произошёл переход на страницу билда');
      })
      .assertView('detailsPage', '#detailsPage', { screenshotDelay: 10 })
  })

})


describe('Проверка работы страницы details', function() {

    beforeEach(async function() {
    await axiosInstance.delete('/conf');
    await this.browser
      .url('settings')
      .waitForExist('#settingsPage')
      .click('#repository')
      .keys([testedConf.repoName])
      .click('#build')
      .keys([testedConf.buildCommand])
      .click('#branch')
      .keys([testedConf.mainBranch])
      .click('#period')
      .keys(['0'])
      .click('#save')
      .waitForExist('#historyPage');
    await this.browser.pause(500);
  })

  it('По клику на кнопку rebuid, коммит снова ставится в очередь на сборку', function() {
    return this.browser
      .url('/')
      .waitForExist('#historyPage')
      .click('#buildList:first-child')
      .waitForExist('#detailsPage')
      .click('#rebuild')
      .pause(1000)
      .isExisting('#detailsPage')
      .then((exists) => {
        assert.ok(exists, 'Ошибка с постановкой на сборку');
      })
      .assertView('detailsPage', '#detailsPage', { screenshotDelay: 10 })
  })

  it('Можно перейти со страницы details к настройкам по кнопке "settings" в header', function() {
    return this.browser
      .url('/')
      .waitForExist('#historyPage')
      .pause(500)
      .click('#buildList:first-child')
      .waitForExist('#detailsPage')
      .pause(500)
      .click('#toSettings')
      .waitForExist('#settingsPage')
      .pause(500)
      .isExisting('#settingsPage')
      .then((exists) => {
        assert.ok(exists, 'Не удалось перейти по ссылке к настройкам');
      })
      .assertView('settingsPage', '#settingsPage', { screenshotDelay: 10 })
  })

  it('Можно перейти со страницы details на страницу history по клику на название репозитория', function() {
    return this.browser
      .url('/')
      .waitForExist('#historyPage')
      .pause(500)
      .click('#buildList:first-child')
      .waitForExist('#detailsPage')
      .pause(500)
      .click('#reponame')
      .waitForExist('#historyPage')
      .pause(500)
      .isExisting('#historyPage')
      .then((exists) => {
        assert.ok(exists, 'Не удалось перейти по ссылке на страницу history');
      })
      .assertView('historyPage', '#historyPage', { screenshotDelay: 10 })
  })

})
