import { Component, Prop, State, Listen } from "@stencil/core";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import {
  fetchAddressSuggestions,
  fetchSelectedAddress,
  storeSessionStorage,
  isValidSelectedAddress
} from "./address-search.service";
import { SELECTED_ADDRESS_KEY } from "./address-search.config";

// http://localhost:3333/build/
@Component({
  tag: "agl-address-search",
  styleUrl: "address-search.css",
  shadow: true
})
export class AddressSearch {
  // component props
  @Prop() redirect: string;
  @Prop() minInputChars: number = 7;
  @Prop() debounceTimeout: number = 500;

  // component state
  @State() suggestions: any;
  @State() searchboxValue: string;
  @State() isSearching: boolean = false;
  @State() activeSuggestion: number = -1;
  @State() showSuggestions: boolean = false;
  @State() isAddressSelected: boolean = false;

  @Listen("body:click")
  handleScroll() {
    if (this.showSuggestions) {
      this.showSuggestions = false;
    }
  }

  handleInputFocus() {
    if (this.suggestions && this.suggestions.length > 0) {
      this.showSuggestions = true;
    }
  }

  fetchAddressDebounced = AwesomeDebouncePromise(async searchTerm => {
    this.isSearching = true;
    return fetchAddressSuggestions(searchTerm);
  }, this.debounceTimeout);

  async handleChange(ev) {
    this.searchboxValue = ev.target.value;

    if (this.searchboxValue.length < this.minInputChars) {
      this.suggestions = [];
      this.showSuggestions = false;
      this.isAddressSelected = false;
      return;
    }
    try {
      this.suggestions = await this.fetchAddressDebounced(this.searchboxValue);
      this.showSuggestions = true;
    } catch (err) {
      // handle err
      this.suggestions = [];
      this.showSuggestions = false;
    } finally {
      this.isSearching = false;
    }
  }

  async handleClickSuggestion(suggestion) {
    this.searchboxValue = suggestion.PartialAddress;
    this.showSuggestions = false;
    this.isAddressSelected = false;

    try {
      this.isSearching = true;
      const addressDetails = await fetchSelectedAddress(
        suggestion.Moniker,
        suggestion.PartialAddress
      );

      if (isValidSelectedAddress(addressDetails)) {
        const model = {
          details: addressDetails.SearchResponse,
          address: suggestion.PartialAddress
        };
        storeSessionStorage(SELECTED_ADDRESS_KEY, model);

        this.isAddressSelected = true;
      } else {
        // handle error message
      }
    } catch (err) {
      // handle err
    } finally {
      this.isSearching = false;
    }
  }

  handleSearchClick() {
    // store address into in Session Storage
    if (this.isAddressSelected) {
      window.location.href = this.redirect;
    }
  }

  handleAddressNotFound() {
    window.location.href = `${this.redirect}/#/v2/manual-address`;
  }

  render() {
    return (
      <div class="address-search">
        <input
          type="text"
          class="address-search__input"
          placeholder="Enter your home address here "
          value={this.searchboxValue}
          onInput={event => this.handleChange(event)}
          onFocus={this.handleInputFocus.bind(this)}
        />
        {this.isSearching ? (
          <agl-spinner class="address-search__spinner" />
        ) : (
          " "
        )}

        {this.showSuggestions && !this.isSearching ? (
          <div class="address-search__result-container">
            <ul>
              {this.suggestions.map(suggestion => (
                <li class="address-search__result">
                  <a
                    href="javascript:void(0)"
                    class="address-search__result--link"
                    onClick={() => this.handleClickSuggestion(suggestion)}
                  >
                    {suggestion.PartialAddress}
                  </a>
                </li>
              ))}
              <li class="address-search__result">
                <a
                  href="javascript:void(0)"
                  class="address-search__result--link"
                  onClick={() => this.handleAddressNotFound()}
                >
                  <strong>My address wasn't found</strong>
                </a>
              </li>
            </ul>
          </div>
        ) : (
          " "
        )}
        <button
          class="address-search__button"
          onClick={() => this.handleSearchClick()}
        >
          Get an Estimate
        </button>
      </div>
    );
  }
}
