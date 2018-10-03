import { Component, Prop, State } from "@stencil/core";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import {
  fetchAddressSuggestions,
  fetchSelectedAddress,
  storeSessionStorage,
  isValidSelectedAddress
} from "./address-search.service";
import { SELECTED_ADDRESS_KEY } from "./address-search.config";

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
  @State() showSuggestions: boolean = false;
  @State() isAddressSelected: boolean = false;
  @State() isSearching: boolean = false;
  @State() searchboxValue: string;

  fetchAddressDebounced = AwesomeDebouncePromise(async searchTerm => {
    this.isSearching = true;
    return fetchAddressSuggestions(searchTerm);
  }, this.debounceTimeout);

  async handleChange(ev) {
    this.searchboxValue = ev.target.value;

    if (this.searchboxValue.length < this.minInputChars) {
      this.showSuggestions = false;
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
          address: this.searchboxValue
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
          placeholder="Start typing address here"
          value={this.searchboxValue}
          onInput={event => this.handleChange(event)}
        />
        {this.isSearching ? (
          <agl-spinner class="address-search__spinner" />
        ) : (
          " "
        )}
        <button
          class="address-search__button"
          onClick={() => this.handleSearchClick()}
        >
          Search
        </button>
        {this.showSuggestions && !this.isSearching ? (
          <div class="address-search__result-container">
            <ul>
              {this.suggestions.map(suggestion => (
                <li
                  class="address-search__result"
                  onClick={() => this.handleClickSuggestion(suggestion)}
                >
                  {suggestion.PartialAddress}
                </li>
              ))}
              <li
                class="address-search__result"
                onClick={() => this.handleAddressNotFound()}
              >
                <strong>My address wasn't found</strong>
              </li>
            </ul>
          </div>
        ) : (
          " "
        )}
      </div>
    );
  }
}
