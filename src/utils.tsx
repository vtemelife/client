import { Parser } from "html-to-react";
import { toast } from "react-toastify";
import { _ } from "trans";

/**
 * Get display value
 * @param {string}
 * @param {list}
 */
export const getDisplayValue = (value: any, valueset: any[]) => {
  const elements = valueset.filter(i => i.value === value).map(i => i.display);
  if (elements.length === 1) {
    return elements[0];
  }
  return "";
};

/**
 * Get cookie by name
 * @param {string}
 */
export function getCookie(name: string) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    // tslint:disable-next-line
    for (let i = 0; i < cookies.length; i += 1) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === `${name}=`) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

/**
 * Get request options
 */
export const requestOptions = () => {
  const headers = {} as any;
  const csrftoken = getCookie("csrftoken");
  const locale = localStorage.getItem("locale") || "ru";
  if (csrftoken) {
    headers["X-CSRFToken"] = csrftoken;
  }
  headers["Accept-Language"] = locale;
  return { headers };
};

/**
 * Get locale
 */
export const getLocale = () => {
  return localStorage.getItem("locale") || "ru";
};

export const changeLocale = (locale: string, location: string) => {
  localStorage.setItem("locale", locale);
  window.location = location as any;
};

/**
 * Get locale
 */
const MOBILE_MAX_WIDTH = 992;
export const isMobile = () => {
  return window.innerWidth <= MOBILE_MAX_WIDTH;
};

/**
 * Get locale
 */
export const isDev = () => {
  return !process.env.NODE_ENV || process.env.NODE_ENV === "development";
};

/**
 * Render HTML
 */
export const renderHtml = (html?: string) => {
  const htmlToReactParser = new Parser();
  const youtubeRegex = /<oembed.+?url="https?:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11}).*"><\/oembed>/g;
  const youtubeShortRegex = /<oembed.+?url="https?:\/\/youtu\.be\/([a-zA-Z0-9_-]{11}).*"><\/oembed>/g;
  const vimeoRegex = /<oembed.+?url="https?:\/\/vimeo\.com\/([0-9]{8}).*"><\/oembed>/g;
  const vkRegex = /<oembed.+?url="https?:\/\/vk\.com\/video([0-9]{9})_([0-9]{9}).*"><\/oembed>/g;
  const htmlToParse = html || "--";
  return htmlToReactParser.parse(
    htmlToParse
      .replace(
        youtubeRegex,
        '<iframe src="https://www.youtube.com/embed/$1" style="height: 500px; width: 100%;" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen=""></iframe>'
      )
      .replace(
        youtubeShortRegex,
        '<iframe src="https://www.youtube.com/embed/$1" style="height: 500px; width: 100%;" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen=""></iframe>'
      )
      .replace(
        vimeoRegex,
        '<iframe src="https://player.vimeo.com/video/$1" style="height: 500px; width: 100%;" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen=""></iframe>'
      )
      .replace(
        vkRegex,
        '<iframe src="https://vk.com/video_ext.php?oid=$1&id=$2" style="height: 500px; width: 100%;" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen=""></iframe>'
      )
  );
};

/**
 * handle Success
 */
export const handleSuccess = (message: string, timeout?: number) => {
  toast.success(message, { autoClose: timeout ? timeout : 5000 });
};

/**
 * handle Errors
 */
export const handleErrors = (errors: any, changeFormErrors?: any) => {
  switch (errors.status) {
    case 400:
      if (changeFormErrors && errors.data) {
        changeFormErrors(errors.data);
      } else {
        // toast.error(errors.message);
      }
      break;
    case 403:
      // toast.error(_("Access denied."));
      break;
    case 408:
    case 503:
    case 504:
    case 521:
    case 522:
    case 523:
    case 524:
      toast.error(_("Service unavailable. Check your network connection."));
      break;
    case 500:
    default:
      toast.error(_("Server error. Please contact to administrator."));
      break;
  }
};
