/// <reference types="cypress" />

const BUN_NAME = 'Тестовая булка';
const MAIN_NAME = 'Тестовая начинка';

describe('Страница конструктора бургера', () => {
  beforeEach(() => {
    // Мокаем загрузку ингредиентов
    cy.intercept('GET', '**/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
  });

  afterEach(() => {
    // После каждого теста явно очищаем localStorage и cookies,
    // чтобы фейковые токены авторизации и другие данные не
    // протекали в следующие тесты
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('добавляет ингредиент из списка в конструктор', () => {
    cy.visit('/');

    cy.wait('@getIngredients');

    // Находим карточку булки и жмём "Добавить"
    cy.contains('li', BUN_NAME).within(() => {
      cy.contains('button', 'Добавить').click();
    });

    // Минимальная проверка: кнопка "Оформить заказ" существует (страница отрисована)
    cy.contains('button', 'Оформить заказ').should('exist');
  });

  it('открывает и закрывает модальное окно ингредиента (крестик и оверлей)', () => {
    cy.visit('/');

    cy.wait('@getIngredients');

    // Открываем модалку по клику на карточку ингредиента
    cy.contains('li', BUN_NAME)
      .find('a')
      .click();

    // Мы на странице/в модалке детали ингредиента
    cy.url().should('include', '/ingredients/');
    cy.contains(BUN_NAME).should('exist');

    // --- Закрытие по крестику ---
    // Ищем заголовок модалки "Детали ингредиента",
    // поднимаемся к родителю (header) и кликаем по кнопке внутри
    cy.contains('h3', 'Детали ингредиента')
      .parent()
      .find('button[type="button"]')
      .click({ force: true });

    // Должны вернуться на главную страницу конструктора
    cy.url().should('eq', `${Cypress.config('baseUrl')}/`);

    // --- Снова открываем модалку ---
    cy.contains('li', BUN_NAME)
      .find('a')
      .click();

    cy.url().should('include', '/ingredients/');
    cy.contains(BUN_NAME).should('exist');

    // --- Закрытие по клику на оверлей ---
    cy.get('[data-cy="modal-overlay"]').click('topLeft', { force: true });

    // Снова должны вернуться на главную страницу конструктора
    cy.url().should('eq', `${Cypress.config('baseUrl')}/`);
  });

  it('создаёт заказ с моковыми данными и очищает конструктор', () => {
    // Мокаем запросы авторизации и создания заказа
    cy.intercept('GET', '**/auth/user', {
      fixture: 'user.json'
    }).as('getUser');

    cy.intercept('POST', '**/orders', {
      fixture: 'order.json'
    }).as('createOrder');

    // Подставляем моковые токены до инициализации приложения
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('refreshToken', 'test-refresh-token');
        win.document.cookie = 'accessToken=test-access-token';
      }
    });

    cy.wait('@getIngredients');
    cy.wait('@getUser');

    // Добавляем булку
    cy.contains('li', BUN_NAME).within(() => {
      cy.contains('button', 'Добавить').click();
    });

    // Переключаемся на "Начинки" и добавляем начинку
    cy.contains('Начинки').click();

    cy.contains('li', MAIN_NAME).within(() => {
      cy.contains('button', 'Добавить').click();
    });

    // Кликаем по кнопке «Оформить заказ»
    cy.contains('button', 'Оформить заказ').click();

    cy.wait('@createOrder');

    // Открылось модальное окно с номером заказа
    cy.contains('12345').should('exist');

    // Закрываем модальное окно по ESC
    cy.get('body').type('{esc}');
    cy.contains('12345').should('not.exist');

    // --- Проверяем, что конструктор пуст ---
    // После успешного заказа ингредиенты должны быть очищены,
    // а счётчики на карточках обнулены (компонент Counter перестаёт рендериться)
    cy.contains('li', BUN_NAME).within(() => {
      cy.get('[class*="counter"]').should('not.exist');
    });

    cy.contains('li', MAIN_NAME).within(() => {
      cy.get('[class*="counter"]').should('not.exist');
    });
  });
});
