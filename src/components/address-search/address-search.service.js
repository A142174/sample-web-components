const selectedAddressKey = "AGL-selected-address";
const baseUrl = "https://agldstfeature14.digital.agl.com.au";

const fetchAddressSuggestions = async searchTerm => {
  const maxResults = "5";
  const searchType = "SiteAddressSearch";
  const url = `${baseUrl}/svc/QAS/GetSearchResult?searchKey=${searchTerm}&maxResults=${maxResults}&searchType=${searchType}`;

  const response = await fetch(url);
  const data = await response.json();
  return data.data;
};

const fetchSelectedAddress = async (moniker, address) => {
  const url = `${baseUrl}/svc/QAS/ReturnSelectedAddress?selectedValue=${moniker}&selectedText=${address}`;
  const response = await fetch(url);
  const data = await response.json();

  if (isValidSelectedAddress(data)) {
    storeSessionStorage(selectedAddressKey, data.SearchResult.SearchResponse);
    return data.SearchResult;
  }

  throw "Error fetching address.";
};

const storeSessionStorage = (key, model) => {
  window.sessionStorage.setItem(key, JSON.stringify(model));
};

const isValidSelectedAddress = response => {
  return (
    response &&
    response.SearchResult &&
    response.SearchResult.ErrorMessage == null &&
    response.SearchResult.SearchResponse
  );
};

export { fetchAddressSuggestions, fetchSelectedAddress };
