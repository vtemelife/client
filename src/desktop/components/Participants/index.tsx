import React from "react";
import { Card, Media } from "react-bootstrap";
import { Link } from "react-router-dom";

import Image from "generic/components/Image";
import userSVG from "generic/layout/images/user.svg";
import { CLIENT_URLS } from "desktop/routes/client";
import { _ } from "trans";

interface IProps {
  title?: string;
  participants: object[];
}

class Participants extends React.PureComponent<IProps> {
  public render() {
    return (
      <Card>
        <Card.Body>
          <Card.Title>
            {this.props.title ? this.props.title : _("Participants")}
          </Card.Title>
          <div className="participants-container">
            {this.props.participants.length === 0 ? "-" : null}
            {this.props.participants.map((item: any, index) => (
              <Link
                key={index}
                to={CLIENT_URLS.USER.PROFILE.buildPath({ userSlug: item.slug })}
              >
                <Media className="participant">
                  {item.avatar && item.avatar.thumbnail_100x100 ? (
                    <Image
                      width={50}
                      height={50}
                      className="mr-1"
                      src={item.avatar.thumbnail_100x100}
                      roundedCircle={true}
                    />
                  ) : (
                    <Image
                      width={50}
                      height={50}
                      className="mr-1"
                      src={userSVG}
                      roundedCircle={true}
                    />
                  )}
                  <Media.Body>
                    <div className="username">{item.name}</div>
                  </Media.Body>
                </Media>
              </Link>
            ))}
          </div>
        </Card.Body>
      </Card>
    );
  }
}

export default Participants;
