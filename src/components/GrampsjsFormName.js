/*
element for editing a name
*/

import {html, css, LitElement} from 'lit'
import '@material/mwc-textfield'
import '@material/mwc-icon-button'
import '@material/mwc-icon'

import {classMap} from 'lit/directives/class-map.js'
import {sharedStyles} from '../SharedStyles.js'
import {fireEvent} from '../util.js'
import './GrampsjsFormString.js'
import './GrampsjsFormSurname.js'
import {GrampsjsTranslateMixin} from '../mixins/GrampsjsTranslateMixin.js'

class GrampsjsFormName extends GrampsjsTranslateMixin(LitElement) {
  static get styles() {
    return [
      sharedStyles,
      css`
        mwc-textfield.fullwidth {
          width: 100%;
        }

        .hide {
          display: none;
        }

        mwc-icon-button {
          color: rgba(0, 0, 0, 0.5);
        }
      `,
    ]
  }

  static get properties() {
    return {
      data: {type: Object},
      showMore: {type: Boolean},
      types: {type: Object},
      typesLocale: {type: Object},
      origintype: {type: Boolean},
    }
  }

  constructor() {
    super()
    this.data = {_class: 'Name'}
    this.showMore = false
    this.types = {}
    this.typesLocale = {}
    this.origintype = false
  }

  render() {
    return html`
      <p class="${classMap({hide: !this.showMore})}">
        <grampsjs-form-string
          @formdata:changed="${this._handleFormData}"
          fullwidth
          id="title"
          value="${this.data.title || ''}"
          label="${this._('Title')}"
        ></grampsjs-form-string>
      </p>
      <p>
        <grampsjs-form-string
          @formdata:changed="${this._handleFormData}"
          fullwidth
          id="first_name"
          value="${this.data.first_name || ''}"
          label="${this._('Given name')}"
        ></grampsjs-form-string>
      </p>
      <p class="${classMap({hide: !this.showMore})}">
        <grampsjs-form-string
          @formdata:changed="${this._handleFormData}"
          fullwidth
          id="suffix"
          value="${this.data.suffix || ''}"
          label="${this._('Suffix')}"
        ></grampsjs-form-string>
      </p>
      <p class="${classMap({hide: !this.showMore})}">
        <grampsjs-form-string
          @formdata:changed="${this._handleFormData}"
          fullwidth
          id="call"
          value="${this.data.call || ''}"
          label="${this._('Call name')}"
        ></grampsjs-form-string>
      </p>
      <p class="${classMap({hide: !this.showMore})}">
        <grampsjs-form-string
          @formdata:changed="${this._handleFormData}"
          fullwidth
          id="nick"
          value="${this.data.nick || ''}"
          label="${this._('Nick name')}"
        ></grampsjs-form-string>
      </p>
      <p class="${classMap({hide: !this.showMore})}">
        <grampsjs-form-string
          @formdata:changed="${this._handleFormData}"
          fullwidth
          id="famnick"
          value="${this.data.famnick || ''}"
          label="${this._('Family nick name')}"
        ></grampsjs-form-string>
      </p>

      <h4 class="label ${classMap({hide: !this.showMore})}">${this._(
      'Surnames'
    )}</h4>

      ${(this.data.surname_list || [{}]).map(
        (obj, i, arr) => html`
          <grampsjs-form-surname
            ?origintype="${this.origintype}"
            ?showMore="${this.showMore}"
            id="surnames${i}"
            idx="${i}"
            @formdata:changed="${this._handleFormData}"
            .strings="${this.strings}"
            .data="${obj}"
            .types="${this.types}"
            .typesLocale="${this.typesLocale}"
          >
          </grampsjs-form-surname>

          ${i < arr.length - 1 ? html`<hr />` : ''}
        `
      )}
      <p class="${classMap({hide: !this.showMore})}">
        <mwc-icon-button
          @click="${this._handleAddSurname}"
          icon="add"
        ></mwc-button>
      </p>

      ${
        this.showMore
          ? ''
          : html`
    <mwc-icon-button
      @click="${this._handleShowMore}"
      icon="more_horiz"
    ></mwc-button>
  `
      }
    `
  }

  _handleShowMore() {
    this.showMore = true
  }

  reset() {
    this.shadowRoot
      .querySelectorAll('grampsjs-form-string')
      .forEach(element => element.reset())
    this.shadowRoot.querySelector('grampsjs-form-surname').reset()
    this.showMore = false
    this.data = {_class: 'Name'}
  }

  handleChange() {
    fireEvent(this, 'formdata:changed', {data: this.data})
  }

  _handleAddSurname() {
    this.data = {
      ...this.data,
      surname_list: [...(this.data.surname_list || [{}]), {}],
    }
  }

  _handleFormData(e) {
    const originalTarget = e.composedPath()[0]
    if (
      ['first_name', 'call', 'nick', 'famnick', 'title', 'suffix'].includes(
        originalTarget.id
      )
    ) {
      this.data = {...this.data, [originalTarget.id]: e.detail.data}
    } else if (originalTarget.id.startsWith('surnames')) {
      const i = e.detail.idx
      const surnameList = this.data.surname_list || []
      this.data = {
        ...this.data,
        surname_list: [
          ...surnameList.slice(0, i),
          e.detail.data,
          ...surnameList.slice(i + 1),
        ],
      }
    }
    e.stopPropagation()
    this.handleChange()
  }
}

window.customElements.define('grampsjs-form-name', GrampsjsFormName)
