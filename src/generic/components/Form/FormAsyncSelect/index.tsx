import React from "react";
import { Form } from "react-bootstrap";
import AsyncSelect from "react-select/lib/Async";
import { debounce } from "throttle-debounce";

import { requestOptions } from "utils";

class FormAsyncSelect extends React.PureComponent<any> {
  public onSuggestionsFetchRequested = debounce(
    this.props.throttleDelay || 500,
    (input: any, callback: any) => {
      this.loadOptions(input, callback);
    }
  );
  public loadOptions = (input: any, callback: any) => {
    const url = `${this.props.fetchURL}?search=${input}${
      this.props.filterURL ? `&${this.props.filterURL}` : ""
    }`;
    fetch(url, requestOptions())
      .then(response => response.json())
      .then(data => callback(data))
      .catch(error => null);
  };

  public render() {
    const {
      name,
      errors,
      help,
      label,
      fetchURL,
      onChange,
      getOptionLabel,
      getOptionValue,
      isDisabled,
      ...props
    } = this.props;
    return (
      <Form.Group>
        {label ? <Form.Label>{label}</Form.Label> : null}
        <AsyncSelect
          defaultOptions={!isDisabled}
          isDisabled={isDisabled}
          cacheOptions={false}
          isClearable={true}
          name={name}
          className={errors ? "form-error" : ""}
          classNamePrefix="select"
          loadOptions={this.onSuggestionsFetchRequested}
          onChange={data => onChange({ name, value: data })}
          getOptionLabel={
            getOptionLabel ? getOptionLabel : (option: any) => option.name
          }
          getOptionValue={
            getOptionValue ? getOptionValue : (option: any) => option.pk
          }
          {...props}
        />
        {errors
          ? errors.map((error: string, index: number) => (
              <Form.Text className="text-error" key={index}>
                {error}
              </Form.Text>
            ))
          : null}
        {help ? <Form.Text className="text-muted">{help}</Form.Text> : null}
      </Form.Group>
    );
  }
}

export default FormAsyncSelect;
