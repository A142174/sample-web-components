import { Component, Prop, State } from "@stencil/core";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import {
  fetchAddressSuggestions,
  fetchSelectedAddress
} from "./address-search.service";

@Component({
  tag: "agl-address-search",
  styleUrl: "address-search.css",
  shadow: true
})
export class AddressSearch {
  @Prop() redirect: string;
  @State() suggestions: any;
  @State() showSuggestions: boolean = false;
  @State() isAddressSelected: boolean = false;
  @State() isSearching: boolean = false;
  @State() searchboxValue: string;

  minInputChars: number = 7;
  debounceTimeout: number = 500;
  fetchAddressDebounced = AwesomeDebouncePromise(
    fetchAddressSuggestions,
    this.debounceTimeout
  );

  async handleChange(ev) {
    this.searchboxValue = ev.target.value;

    if (this.searchboxValue.length < this.minInputChars) {
      this.showSuggestions = false;
      return;
    }
    try {
      this.isSearching = true;
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

    try {
      this.isSearching = true;
      const addressDetails = await fetchSelectedAddress(
        suggestion.Moniker,
        suggestion.PartialAddress
      );

      if (addressDetails.ErrorMessage != null) {
        // store addressDetails.SearchResponse in session storage
      }
      this.isAddressSelected = true;
    } catch (err) {
      // handle err
      this.isAddressSelected = false;
    } finally {
      this.isSearching = false;
    }
  }

  handleClick() {
    // store address into in Session Storage
    if (this.isAddressSelected) {
      window.location.href = this.redirect;
    }
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
          onClick={() => this.handleClick()}
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
            </ul>
          </div>
        ) : (
          " "
        )}
      </div>
    );
  }
}
