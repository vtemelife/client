import { Url } from "routes/utils";

export const GAME_URLS = {
  FORMAT: new Url("/game/fanty/"),
  CARD: new Url("/game/fanty/:format/card/")
};
