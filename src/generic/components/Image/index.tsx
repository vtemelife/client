import React from "react";
import { Image } from "react-bootstrap";

import hideSVG from "generic/layout/images/hide.svg";
import { StatesConsumer } from "generic/containers/ContextProviders/StatesService";

const ImageComponent = (props: any) => {
  const { isDisplayImages, ...otherProps } = props;
  if (!isDisplayImages) {
    return (
      <Image
        {...props}
        src={hideSVG}
        onContextMenu={(e: any) => e.preventDefault()}
      />
    );
  }
  return (
    <Image {...otherProps} onContextMenu={(e: any) => e.preventDefault()} />
  );
};

const ImageWrapper: React.FC<any> = props => (
  <StatesConsumer>
    {contextStates =>
      contextStates && (
        <ImageComponent
          {...props}
          isDisplayImages={contextStates.isDisplayImages}
        />
      )
    }
  </StatesConsumer>
);

export default ImageWrapper;
