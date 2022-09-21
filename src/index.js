import './css/styles.css';
import debounce from 'lodash.debounce';
import API from './fetchCountries';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const searchOfCountry = document.querySelector('[id="search-box"]');
const countryInfo = document.querySelector('.country-info');
const countryList = document.querySelector('.country-list');

const listOfcountry = `{{#each this}}<p><img src="{{this.flag}}" width=30>   {{this.name}}</p>{{/each}}`;
const cardOfCountry = `   
    <h2> <img src="{{flag}}" width=50>  {{name}}</h2>
    <p><b>Capital: </b> {{capital}}</p>
    <p><b>Population: </b> {{population}}</p>
    <span ><b>Languages: </b> {{#each languages}}<span> {{this}}</span>{{/each}}</span>`;

const handlebars = require('handlebars');
const cardOfCountryCompile = handlebars.compile(cardOfCountry);
const listOfcountryCompile = handlebars.compile(listOfcountry);

searchOfCountry.addEventListener(
  'input',
  debounce(countryInput, DEBOUNCE_DELAY)
);

function countryInput(e) {
  const requestValue = e.target.value.trim();
  if (requestValue === '') {
    resetCardOfCountry();
    return;
  }
  API.fetchCountries(requestValue, errorNotification).then(render);
}

function countriesInfo(country) {
  const languages = countryLanguage(country);
  const capital = country.capital;
  const population = country.population;
  const flag = country.flags.svg;
  const name = country.name.official;

  return { flag, name, capital, population, languages };
}

function countryLanguage(country) {
  return Object.values(country.languages);
}

function notification() {
  Notiflix.Notify.info(
    'Too many matches found. Please enter a more specific name.',
    { timeout: 5000 }
  );
}

function errorNotification() {
  notification;
  Notiflix.Notify.failure('Oops, there is no country with that name', {
    timeout: 5000,
  });
}

function render(p) {
  reset();
  if (p.length === 1) {
    const country = countriesInfo(p[0]);
    renderCardOfCountry(country);
    return;
  } else if (p.length < 10) {
    const countries = p.map(countriesInfo);
    renderListOfcountry(countries);
    return;
  } else if (p.length > 10) {
    notification();
  }
}

function renderCardOfCountry(country, languages) {
  const markup = cardOfCountryCompile(country, languages);
  countryInfo.innerHTML = markup;
}

function renderListOfcountry(countries) {
  const markup = listOfcountryCompile(countries);
  countryList.innerHTML = markup;
}

function reset() {
  resetCardOfCountry();
  resetListOfcountry();
}

function resetCardOfCountry() {
  countryInfo.innerHTML = '';
}

function resetListOfcountry() {
  countryList.innerHTML = '';
}
