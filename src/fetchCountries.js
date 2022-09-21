const BASE_URL = 'https://restcountries.com/v3.1';

function fetchCountries(name, error) {
  return fetch(`${BASE_URL}/name/${name}`).then(res => {
    if (!res.ok) {
      throw new Error(res.status);
      return error();
    }
    return res.json();
  });
}

export default { fetchCountries };
