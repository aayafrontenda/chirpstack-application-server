import React, { Component } from "react";

import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";

import Refresh from "mdi-material-ui/Refresh";

import MaskedInput from "react-text-mask";

import { formatMessage as translate } from "devextreme/localization";

class DevAddrMask extends Component {
  render() {
    const { inputRef, ...other } = this.props;

    return (
      <MaskedInput
        {...other}
        ref={(ref) => {
          inputRef(ref ? ref.inputElement : null);
        }}
        mask={[
          /[A-Fa-f0-9]/,
          /[A-Fa-f0-9]/,
          " ",
          /[A-Fa-f0-9]/,
          /[A-Fa-f0-9]/,
          " ",
          /[A-Fa-f0-9]/,
          /[A-Fa-f0-9]/,
          " ",
          /[A-Fa-f0-9]/,
          /[A-Fa-f0-9]/,
        ]}
      />
    );
  }
}

class DevAddrField extends Component {
  constructor() {
    super();

    this.state = {
      msb: true,
      value: "",
    };
  }

  toggleByteOrder = () => {
    this.setState({
      msb: !this.state.msb,
    });

    const bytes = this.state.value.match(/[A-Fa-f0-9]{2}/g);
    if (bytes !== null) {
      this.setState({
        value: bytes.reverse().join(" "),
      });
    }
  };

  randomKey = () => {
    this.props.randomFunc((k) => {
      let key = k;
      const bytes = key.match(/[\w]{2}/g);
      if (!this.state.msb && bytes !== null) {
        key = bytes.reverse().join("");
      }

      this.setState({
        value: key,
      });

      this.props.onChange({
        target: {
          value: k,
          type: "text",
          id: this.props.id,
        },
      });
    });
  };

  onChange = (e) => {
    this.setState({
      value: e.target.value,
    });

    let str = "";

    const bytes = e.target.value.match(/[\w]{2}/g);
    if (!this.state.msb && bytes !== null) {
      str = bytes.reverse().join("");
    } else if (bytes !== null) {
      str = bytes.join("");
    }

    this.props.onChange({
      target: {
        value: str,
        type: "text",
        id: this.props.id,
      },
    });
  };

  componentDidMount() {
    this.setState({
      value: this.props.value || "",
    });
  }

  render() {
    return (
      <TextField
        type="text"
        InputProps={{
          inputComponent: DevAddrMask,
          endAdornment: (
            <InputAdornment position="end">
              <Tooltip title={translate("toggleByteOrder")}>
                <Button
                  aria-label="Toggle byte order"
                  onClick={this.toggleByteOrder}
                >
                  {this.state.msb ? "MSB" : "LSB"}
                </Button>
              </Tooltip>
              {this.props.random && !this.props.disabled && (
                <Tooltip title={translate("generateRandomDeviceAddress")}>
                  <IconButton
                    aria-label="Generate random key"
                    onClick={this.randomKey}
                  >
                    <Refresh />
                  </IconButton>
                </Tooltip>
              )}
            </InputAdornment>
          ),
        }}
        {...this.props}
        onChange={this.onChange}
        value={this.state.value}
        disabled={this.props.disabled}
      />
    );
  }
}

export default DevAddrField;
