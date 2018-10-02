import { Component, Prop } from "@stencil/core";

@Component({
  tag: "agl-spinner",
  styleUrl: "spinner.css",
  shadow: false
})
export class Spinner {
  @Prop() text: string;
  render() {
    return (
      <div class="agl-spinner">
        <svg
          viewBox="0 0 40 40"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g
            id="Symbols"
            stroke="none"
            stroke-width="1"
            fill="none"
            fill-rule="evenodd"
          >
            <g id="hand">
              <line class="first" x1="7" y1="28.7" x2="17" y2="30.2" />
              <line class="second" x1="10" y1="12.6" x2="18.7" y2="22.8" />
              <line class="third" x1="21.9" y1="6" x2="23.5" y2="18.9" />
              <line class="fourth" x1="32.7" y1="9.5" x2="29" y2="19.1" />
              <line class="fifth" x1="38.5" y1="17" x2="34.1" y2="21.6" />
            </g>
          </g>
        </svg>
        <p class="agl-spinner__text">{this.text}</p>
      </div>
    );
  }
}
