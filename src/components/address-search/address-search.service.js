const fetchAddressSuggestions = async searchTerm => {
  const maxResults = "5";
  const searchType = "SiteAddressSearch";
  const url = `https://agldstfeature14.digital.agl.com.au/svc/QAS/GetSearchResult?searchKey=${searchTerm}&maxResults=${maxResults}&searchType=${searchType}`;

  const response = await fetch(url);
  const data = await response.json();
  return data.data;
};

export { fetchAddressSuggestions };
