import React from "react";

import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";

import ResponseErrors from "../ResponseErrors";
import Loading from "generic/components/Loading";

interface IProps {
  response: any;
  loading: boolean;
  error: any;

  renderItem: any;
  getParams: any;

  scrollTop?: boolean;
  scrollBottom?: boolean;
}

const localizer = momentLocalizer(moment);

class BlockCalendar extends React.Component<IProps> {
  public state = {
    events: [
      {
        start: new Date(),
        end: new Date(),
        title: "Some title"
      }
    ]
  };

  public render() {
    if (this.props.error) {
      return <ResponseErrors error={this.props.error} />;
    }
    if (!this.props.response || this.props.loading) {
      return <Loading />;
    }
    return (
      <div className="event-calendar-container">
        <Calendar
          localizer={localizer}
          events={this.state.events}
          defaultDate={new Date()}
          defaultView="month"
          views={["month", "week"]}
        />
      </div>
    );
  }
}

export default BlockCalendar;
