import { Component, Prop, State } from "@stencil/core";
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

  async handleChange(ev) {
    this.value = ev.target.value;

    if (this.value.length < 7) {
      this.showSuggestions = false;
      return;
    }
    setTimeout(async () => {
      try {
        this.isSearching = true;
        this.suggestions = await fetchAddressSuggestions(this.value);
        this.showSuggestions = true;
        this.isSearching = false;
      } catch (err) {
        // handle err
        this.suggestions = [];
        this.showSuggestions = false;
        this.isSearching = false;
      }
    }, 500);
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