import { Component, Prop, State } from "@stencil/core";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import { fetchAddressSuggestions } from "./address-search.service.js";

@Component({
  tag: "agl-address-search",
  styleUrl: "address-search.css",
  shadow: true
})
export class AddressSearch {
  @Prop() redirect: string;
  @State() suggestions: any;
  @State() showSuggestions: boolean = false;
  @State() addressSelected: boolean = false;
  @State() isSearching: boolean = false;
  @State() value: string;

  minInputChars: number = 7;
  debounceTimeout: number = 500;
  fetchAddressDebounced = AwesomeDebouncePromise(
    fetchAddressSuggestions,
    this.debounceTimeout
  );

  async handleChange(ev) {
    this.value = ev.target.value;

    if (this.value.length < this.minInputChars) {
      this.showSuggestions = false;
      return;
    }
    try {
      this.isSearching = true;
      this.suggestions = await this.fetchAddressDebounced(this.value);
      this.showSuggestions = true;
      this.isSearching = false;
    } catch (err) {
      // handle err
      this.suggestions = [];
      this.showSuggestions = false;
      this.isSearching = false;
    }
  }

  handleClickSuggestion(suggestion) {
    this.value = suggestion.PartialAddress;
    this.showSuggestions = false;
    this.addressSelected = true;
  }

  handleClick() {
    // store address into in Session Storage
    if (this.addressSelected) {
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
          value={this.value}
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
