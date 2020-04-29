import { _ } from "trans";

export const DENIED_VALUE = "denied";

export const ROLE_GUEST = "guest";
export const ROLE_MEMBER = "member";
export const ROLE_ORGANIZER = "organizer";
export const ROLE_MODERATOR = "moderator";
export const ROLES = [
  { value: ROLE_GUEST, display: _("Guest") },
  { value: ROLE_MEMBER, display: _("User") },
  { value: ROLE_ORGANIZER, display: _("Manager") },
  { value: ROLE_MODERATOR, display: _("Moderator") }
];

export const REQUEST_NONE = undefined;
export const REQUEST_APPROVED = "approved";
export const REQUEST_WAITING = "waiting";
export const REQUEST_DECLINED = "declined";
export const REQUESTS = [
  { value: REQUEST_NONE, display: _("All") },
  { value: REQUEST_APPROVED, display: _("Approved") },
  { value: REQUEST_DECLINED, display: _("Declined") },
  { value: REQUEST_WAITING, display: _("Pending") }
];

export const THEME_SWING = "swing";
export const THEME_BDSM = "bdsm";
export const THEME_VIRT = "virt";
export const THEME_LGBT = "lgbt";
export const THEME_POLIAMORIA = "poliamoria";
export const THEME_OTHER = "other";
export const USER_THEMES = [
  { value: THEME_SWING, display: _("Swing") },
  { value: THEME_BDSM, display: _("BDSM") },
  { value: THEME_LGBT, display: _("LGBT") },
  { value: THEME_POLIAMORIA, display: _("Poliamoria") },
  { value: THEME_VIRT, display: _("Virt") },
  { value: THEME_OTHER, display: _("Other") }
];
export const COMMUNITY_THEMES = [
  { value: THEME_SWING, display: _("Swing") },
  { value: THEME_BDSM, display: _("BDSM") },
  { value: THEME_LGBT, display: _("LGBT") },
  { value: THEME_POLIAMORIA, display: _("Poliamoria") },
  { value: THEME_OTHER, display: _("Other") }
];

export const TYPE_OPEN = "open";
export const TYPE_CLOSE = "close";
export const COMMUNITY_TYPES = [
  { value: TYPE_OPEN, display: _("Open") },
  { value: TYPE_CLOSE, display: _("Close") }
];

export const PERMISSION_NO_USERS = "no_users";
export const PERMISSION_ONLY_FRIENDS = "only_friends";
export const PERMISSION_ALL_USERS = "all_users";
export const PERMISSIONS = [
  { value: PERMISSION_NO_USERS, display: _("Nobody") },
  { value: PERMISSION_ONLY_FRIENDS, display: _("Only friends") },
  { value: PERMISSION_ALL_USERS, display: _("All users") }
];

export const FORMAT_SWING_OPEN_SWING = "open_swing";
export const FORMAT_SWING_CLOSE_SWING = "close_swing";
export const FORMAT_SWING_SOFT_SWING = "soft_swing";
export const FORMAT_SWING_WMW = "wmw";
export const FORMAT_SWING_MWM = "mwm";
export const FORMAT_SWING_GANGBANG = "gangbang";
export const FORMAT_SWING_SEXWIFE = "sexwife";
export const FORMAT_SWING_HOTWIFE = "hotwife";
export const FORMAT_SWING_CUCKOLD = "cuckold";
export const FORMAT_SWING_CUCKQUEEN = "cuckqueen";
export const FORMAT_BDSM_TOP = "top";
export const FORMAT_BDSM_BOTTOM = "bottom";
export const FORMAT_BDSM_SWITCH = "switch";
export const FORMAT_LGBT_ACTIVE = "lgbt_active";
export const FORMAT_LGBT_PASSIVE = "lgbt_passive";
export const FORMAT_LGBT_SWITCH = "lgbt_switch";
export const FORMAT_POLIAMORIA = "format_poliamoria";
export const FORMAT_VIRT = "format_virt";
export const FORMAT_OTHER = "format_other";
export const USER_SWING_FORMATS = [
  { value: FORMAT_SWING_OPEN_SWING, display: _("Open swing") },
  { value: FORMAT_SWING_CLOSE_SWING, display: _("Close swing") },
  { value: FORMAT_SWING_SOFT_SWING, display: _("Soft swing") },
  { value: FORMAT_SWING_WMW, display: _("WMW") },
  { value: FORMAT_SWING_MWM, display: _("MWM") },
  { value: FORMAT_SWING_GANGBANG, display: _("Gang Bang") },
  { value: FORMAT_SWING_SEXWIFE, display: _("Sexwife") },
  { value: FORMAT_SWING_HOTWIFE, display: _("Hotwife") },
  { value: FORMAT_SWING_CUCKOLD, display: _("Cuckold") },
  { value: FORMAT_SWING_CUCKQUEEN, display: _("Cuckqueen") }
];
export const USER_SWING_SINGLE_FORMATS = [
  { value: FORMAT_SWING_WMW, display: _("WMW") },
  { value: FORMAT_SWING_MWM, display: _("MWM") },
  { value: FORMAT_SWING_GANGBANG, display: _("Gang Bang") }
];
export const USER_BDSM_FORMATS = [
  { value: FORMAT_BDSM_TOP, display: _("BDSM top") },
  { value: FORMAT_BDSM_BOTTOM, display: _("BDSM bottom") },
  { value: FORMAT_BDSM_SWITCH, display: _("BDSM switch") }
];
export const USER_LGBT_FORMATS = [
  { value: FORMAT_LGBT_ACTIVE, display: _("LGBT active") },
  { value: FORMAT_LGBT_PASSIVE, display: _("LGBT passive") },
  { value: FORMAT_LGBT_SWITCH, display: _("LGBT switch") }
];
export const USER_POLIAMORIA_FORMATS = [
  { value: FORMAT_POLIAMORIA, display: _("Poliamoria") }
];
export const USER_VIRT_FORMATS = [{ value: FORMAT_VIRT, display: _("Virt") }];
export const USER_OTHER_FORMATS = [
  { value: FORMAT_OTHER, display: _("Other") }
];

export const USER_GENDER_FAMILY = "family";
export const USER_GENDER_MW = "mw";
export const USER_GENDER_M = "m";
export const USER_GENDER_W = "w";
export const USER_GENDER_MM = "mm";
export const USER_GENDER_WW = "ww";
export const USER_GENDER_TRANS = "trans";
export const USER_GENDER = [
  { value: USER_GENDER_FAMILY, display: _("Family MW") },
  { value: USER_GENDER_MW, display: _("Couple MW") },
  { value: USER_GENDER_M, display: _("Man") },
  { value: USER_GENDER_W, display: _("Woman") },
  { value: USER_GENDER_MM, display: _("Couple MM") },
  { value: USER_GENDER_WW, display: _("Couple WW") },
  { value: USER_GENDER_TRANS, display: _("Trans") }
];

export const USER_BL_REASON_WANKER = "wanker";
export const USER_BL_REASON_NO_COMMUNICATION = "wanker";
export const USER_BL_REASON_JUST_SO = "just_so";
export const USER_BL_REASON_OTHER = "other";
export const USER_BL_REASONS = [
  { value: USER_BL_REASON_WANKER, display: _("Wanker") },
  {
    value: USER_BL_REASON_NO_COMMUNICATION,
    display: _("I don't want to communicate with the user")
  },
  { value: USER_BL_REASON_JUST_SO, display: _("Just so") },
  { value: USER_BL_REASON_OTHER, display: _("Other") }
];

export const MEDIA_TYPE_PHOTO = "photo";
export const MEDIA_TYPE_VIDEO = "video";
export const MEDIA_TYPES = [
  { value: MEDIA_TYPE_PHOTO, display: _("Photo") },
  { value: MEDIA_TYPE_VIDEO, display: _("Video") }
];

export const PARTY_STATUS_UNKNOWN = "unknown";
export const PARTY_STATUS_NO = "no";
export const PARTY_STATUS_YES = "yes";
export const PARTY_STATUS_PROBABLY = "probably";
export const PARTY_STATUSES = [
  { value: PARTY_STATUS_UNKNOWN, display: _("Join the party") },
  { value: PARTY_STATUS_NO, display: _("I don't participate") },
  { value: PARTY_STATUS_YES, display: _("I participate") },
  { value: PARTY_STATUS_PROBABLY, display: _("I'm not sure") }
];

export const POST_THEME_SWING = "swing";
export const POST_THEME_SWING_HISTORY = "swing_history";
export const POST_THEME_BDSM = "bdsm";
export const POST_THEME_BDSM_HISTORY = "bdsm_history";
export const POST_THEME_LGBT = "lgbt";
export const POST_THEME_LGBT_HISTORY = "lgbt_history";
export const POST_THEME_SEX = "sex";
export const POST_THEME_SEX_HISTORY = "sex_history";
export const POST_THEMES = [
  { value: POST_THEME_SWING, display: _("SWING") },
  { value: POST_THEME_SWING_HISTORY, display: _("SWING histories") },
  { value: POST_THEME_BDSM, display: _("BDSM") },
  { value: POST_THEME_BDSM_HISTORY, display: _("BDSM histories") },
  { value: POST_THEME_LGBT, display: _("LGBT") },
  { value: POST_THEME_LGBT_HISTORY, display: _("LGBT histories") },
  { value: POST_THEME_SEX, display: _("Sex") },
  { value: POST_THEME_SEX_HISTORY, display: _("Sex histories") }
];

export const MAP_TYPE_CLUB = "club";
export const MAP_TYPE_PARTY = "party";
export const MAP_TYPES = [
  { value: MAP_TYPE_CLUB, display: _("Clubs") },
  { value: MAP_TYPE_PARTY, display: _("Parties") }
];

export const TYPE_SITE_NEWS = "site_news";
export const TYPE_MEDIA = "media";
export const TYPE_ARTICLES = "articles";
export const TYPE_WHISPER = "whisper";
export const TYPE_FRIENDS_MEDIA = "friends_media";
export const TYPE_FRIENDS_ARTICLE = "friends_article";
export const TYPE_FRIENDS_INFO = "friends_info";
export const TYPE_GROUPS_MEDIA = "groups_media";
export const TYPE_GROUPS_ARTICLE = "groups_article";
export const TYPE_CLUBS_MEDIA = "clubs_media";
export const TYPE_CLUBS_ARTICLE = "clubs_article";
export const TYPE_CLUBS_EVENTS = "clubs_events";

export const TYPE_CONVERSATION = "conversation";
export const TYPE_CHAT = "chat";
export const TYPE_CHAT_WITH_MODERATORS = "chat_with_moderators";
export const TYPE_CHAT_WITH_DEVELOPERS = "chat_with_developers";
