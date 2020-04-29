import moment from "moment";

import {
  THEME_SWING,
  THEME_BDSM,
  THEME_LGBT,
  THEME_POLIAMORIA,
  THEME_VIRT,
  THEME_OTHER
} from "generic/constants";
import {
  USER_SWING_FORMATS,
  USER_BDSM_FORMATS,
  USER_LGBT_FORMATS,
  USER_POLIAMORIA_FORMATS,
  USER_VIRT_FORMATS,
  USER_OTHER_FORMATS,
  USER_GENDER_M,
  USER_GENDER_W,
  USER_SWING_SINGLE_FORMATS,
  USER_GENDER_TRANS,
  USER_GENDER_FAMILY,
  USER_GENDER_MW,
  USER_GENDER_MM,
  USER_GENDER_WW
} from "generic/constants";

import { _ } from "trans";

export const getUserFormats = (gender: any, themes: any) => {
  let userFormats = [] as any;
  if (themes && themes.indexOf(THEME_SWING) !== -1) {
    const userSwingFormats =
      gender === USER_GENDER_M ||
      gender === USER_GENDER_W ||
      gender === USER_GENDER_TRANS
        ? USER_SWING_SINGLE_FORMATS
        : USER_SWING_FORMATS;
    userFormats = userFormats.concat(userSwingFormats);
  }
  if (themes && themes.indexOf(THEME_BDSM) !== -1) {
    userFormats = userFormats.concat(USER_BDSM_FORMATS);
  }
  if (themes && themes.indexOf(THEME_LGBT) !== -1) {
    userFormats = userFormats.concat(USER_LGBT_FORMATS);
  }
  if (themes && themes.indexOf(THEME_POLIAMORIA) !== -1) {
    userFormats = userFormats.concat(USER_POLIAMORIA_FORMATS);
  }
  if (themes && themes.indexOf(THEME_VIRT) !== -1) {
    userFormats = userFormats.concat(USER_VIRT_FORMATS);
  }
  if (themes && themes.indexOf(THEME_OTHER) !== -1) {
    userFormats = userFormats.concat(USER_OTHER_FORMATS);
  }
  return userFormats;
};

export const getBirthday = (profile: any) => {
  if (!profile.birthday) {
    return "--";
  }
  const birthday = moment(profile.birthday, "YYYY");
  const age = Math.floor(moment.duration(moment().diff(birthday)).asYears());
  switch (profile.gender.value) {
    case USER_GENDER_FAMILY:
    case USER_GENDER_MW:
    case USER_GENDER_M:
    case USER_GENDER_MM:
      return `${_("М")}: ${profile.birthday} (${age} ${_("лет")})`;
    case USER_GENDER_WW:
      return `${_("Ж")}: ${profile.birthday} (${age} ${_("лет")})`;
    case USER_GENDER_TRANS:
      return `${profile.birthday}`;
    default:
      break;
  }
  return null;
};

export const getBirthdaySecond = (profile: any) => {
  if (!profile.birthday_second) {
    return null;
  }
  const birthdaySecond = moment(profile.birthday_second, "YYYY");
  const ageSecond = Math.floor(
    moment.duration(moment().diff(birthdaySecond)).asYears()
  );
  switch (profile.gender.value) {
    case USER_GENDER_FAMILY:
    case USER_GENDER_MW:
    case USER_GENDER_W:
    case USER_GENDER_WW:
      return `${_("Ж")}: ${profile.birthday_second} (${ageSecond} ${_("лет")})`;
    case USER_GENDER_MM:
      return `${_("М")}: ${profile.birthday_second} (${ageSecond} ${_("лет")})`;
    default:
      break;
  }
  return null;
};

export const getGeo = (user: any) => {
  let geo = "";
  if (user.city && user.city.country && user.city.country.name) {
    geo += `${user.city.country.name} / `;
  }
  if (user.city && user.city.region && user.city.region.name) {
    geo += `${user.city.region.name} / `;
  }
  if (user.city && user.city.name) {
    geo += user.city.name;
  }
  return geo;
};
