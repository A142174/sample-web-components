import { BASE_URL } from "./address-search.config";

const fetchAddressSuggestions = async searchTerm => {
  const maxResults = "5";
  const searchType = "SiteAddressSearch";
  const url = `${BASE_URL}/svc/QAS/GetSearchResult?searchKey=${searchTerm}&maxResults=${maxResults}&searchType=${searchType}`;

  const response = await fetch(url);
  const data = await response.json();
  return data.data;
};

const fetchSelectedAddress = async (moniker, address) => {
  const url = `${BASE_URL}/svc/QAS/ReturnSelectedAddress?selectedValue=${moniker}&selectedText=${address}`;
  const response = await fetch(url);
  const data = await response.json();

  return data.SearchResult;
};

const storeSessionStorage = (key, model) => {
  window.sessionStorage.setItem(key, JSON.stringify(model));
};

const isValidSelectedAddress = response => {
  return response && response.ErrorMessage == null && response.SearchResponse;
};

export {
  fetchAddressSuggestions,
  fetchSelectedAddress,
  storeSessionStorage,
  isValidSelectedAddress
};
