import React from 'react';
import { useGet } from 'restful-react';

import { SERVER_URLS } from 'routes/server';

const ImageViews: React.SFC<any> = ({ currentImage }) => {
  useGet({
    path: SERVER_URLS.MEDIA_DETAIL.buildPath({
      mediaPk: currentImage.pk,
    }),
  });
  return (
    <button key="views" className="gallery-control">
      <i className="fa fa-eye fa-lg" /> <span>{currentImage.views}</span>
    </button>
  );
};

export default ImageViews;
