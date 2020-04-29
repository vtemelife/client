import React from "react";
import hoistNonReactStatics from "hoist-non-react-statics";

export const withProps = (WrapperComponent: any, convertProps: any) => (
  args: any
) => (WrappedComponent: any) => {
  class WithRestWrapper extends React.Component<any, any> {
    public render() {
      const { path, propName, ...restComponentProps } = args;

      return (
        <WrapperComponent
          {...restComponentProps}
          path={path ? path(this.props) : undefined}
        >
          {(...wrapperProps: any) => (
            <WrappedComponent
              {...this.props}
              {...{ [propName]: convertProps(wrapperProps) }}
            />
          )}
        </WrapperComponent>
      );
    }
  }
  return hoistNonReactStatics(WithRestWrapper, WrappedComponent);
};
