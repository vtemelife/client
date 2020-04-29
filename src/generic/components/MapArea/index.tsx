import React from "react";
import { Map, ObjectManager } from "react-yandex-maps";

import Loading from "generic/components/Loading";
import { _ } from "trans";
import { CLIENT_URLS } from "mobile/routes/client";

interface IProps {
  data?: any;
}

const MapArea: React.SFC<IProps> = ({ data }) => {
  const dataConvert = (items: any) => {
    return items.map((item: any) => {
      let url;
      switch (item.type) {
        case "club":
          url = CLIENT_URLS.USER.CLUB_DETAIL.buildPath({
            clubSlug: item.slug
          });
          break;
        case "party":
          url = CLIENT_URLS.USER.PARTY_DETAIL.buildPath({
            partySlug: item.slug
          });
          break;
        default:
          break;
      }
      return {
        type: "Feature",
        id: item.id,
        geometry: item.geometry,
        properties: {
          balloonContentHeader: url
            ? `<a target="_blank" href="${url}">${item.name}</a>`
            : item.name,
          balloonContentBody: url
            ? `<a target="_blank" href="${url}"><img src="${item.image}" /></a>`
            : `<img src="${item.image}" />`,
          balloonContentFooter: url
            ? `<a target="_blank" href="${url}">${_("Go to")}</a>`
            : undefined,
          hintContent: _("Click to see details")
        },
        options: {
          preset:
            item.type === "club"
              ? "islands#blackStretchyIcon"
              : "islands#greenDotIcon"
        }
      };
    });
  };
  if (!data) {
    return <Loading />;
  }
  const features = dataConvert(data);
  return (
    <Map
      defaultState={{ center: [55.76, 37.64], zoom: 4 }}
      width="100%"
      height={`${window.innerHeight - 140}px`}
      modules={["package.full"]}
    >
      <ObjectManager
        options={{
          clusterize: true,
          gridSize: 32
        }}
        objects={{
          preset: "islands#greenDotIcon"
        }}
        clusters={{
          preset: "islands#greenClusterIcons"
        }}
        features={features}
      />
    </Map>
  );
};

export default MapArea;
