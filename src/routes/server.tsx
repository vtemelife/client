import { Url } from "routes/utils";

export const SERVER_URLS = {
  SIGN_IN: new Url("/api/v1/users/sign-in/"),
  SIGN_IN_VERIFY: new Url("/api/v1/users/sign-in-verify"),
  SIGN_OUT: new Url("/api/v1/users/sign-out/"),
  SIGN_UP_STEP_1: new Url("/api/v1/users/sign-up/"),
  SIGN_UP_STEP_2: new Url("/api/v1/users/sign-up/step2/:userPk/"),
  RESET_PASSWORD_STEP_1: new Url("/api/v1/users/reset-password/"),
  RESET_PASSWORD_STEP_2: new Url("/api/v1/users/reset-password/step2/:userPk/"),
  SELECTS: {
    COUNTRY: new Url("/api/v1/selects/country/"),
    REGION: new Url("/api/v1/selects/region/"),
    CITY: new Url("/api/v1/selects/city/"),
    CHAT_MODERATORS: new Url("/api/v1/selects/chat/moderators/"),
    CHAT_USERS: new Url("/api/v1/selects/chat/users/"),
    MODERATORS: new Url("/api/v1/selects/moderators/"),
    CLUBS: new Url("/api/v1/selects/clubs/")
  },
  IMAGE_EDITOR_UPLOAD: new Url("/api/v1/storage/images/upload/"),
  IMAGE_UPLOAD: new Url("/api/v1/storage/images/create/"),
  IMAGE_DELETE: new Url("/api/v1/storage/images/delete/:imagePk/"),
  FILE_UPLOAD: new Url("/api/v1/storage/files/create/"),
  FILE_DELETE: new Url("/api/v1/storage/files/delete/:filePk/"),
  PROFILE: new Url("/api/v1/users/profile/:userSlug/"),
  PROFILE_PK: new Url("/api/v1/users/profile/pk/:userPk/"),
  PROFILE_UPDATE: new Url("/api/v1/users/profile/:userSlug/update/"),
  PROFILE_PASSWORD: new Url("/api/v1/users/profile/:userSlug/password/"),
  PROFILE_DELETE: new Url("/api/v1/users/profile/:userSlug/delete/"),
  PROFILE_GIVE_REAL_STATUS: new Url(
    "/api/v1/users/profile/:userSlug/give_real_status/"
  ),
  FRIENDS_SEARCH: new Url("/api/v1/users/friends/search/"),
  FRIENDS_LIST: new Url("/api/v1/users/friends/list/"),
  FRIENDS_DELETE: new Url("/api/v1/users/friends/delete/:userSlug/"),
  PARTICIPANTS_LIST: new Url("/api/v1/users/participants/list/"),
  BLACKLIST_LIST: new Url("/api/v1/users/blacklist/list/"),
  BLACKLIST_CREATE: new Url("/api/v1/users/blacklist/create/"),
  BLACKLIST_DELETE: new Url("/api/v1/users/blacklist/delete/:blacklistPk/"),
  MEMBERSHIP_REQUESTS_LIST: new Url("/api/v1/memberships/list/"),
  MEMBERSHIP_REQUESTS_CREATE: new Url("/api/v1/memberships/create/"),
  MEMBERSHIP_REQUESTS_UPDATE: new Url(
    "/api/v1/memberships/update/:membershipPk/"
  ),
  MEMBERSHIP_REQUESTS_DELETE: new Url(
    "/api/v1/memberships/delete/:membershipPk/"
  ),
  POSTS: new Url("/api/v1/posts/"),
  POSTS_DETAIL_PK: new Url("/api/v1/posts/pk/:postPk/"),
  POSTS_DETAIL: new Url("/api/v1/posts/:postSlug/"),
  POSTS_CREATE: new Url("/api/v1/posts/create/"),
  POSTS_UPDATE: new Url("/api/v1/posts/:postSlug/update/"),
  POSTS_DELETE: new Url("/api/v1/posts/:postSlug/delete/"),
  POSTS_LIKE: new Url("/api/v1/posts/:postSlug/like/"),
  WHISPER_TO_MODERATE: new Url("/api/v1/posts/:postSlug/whisper-to-moderate/"),
  POSTS_TO_MODERATE: new Url("/api/v1/posts/:postSlug/post-to-moderate/"),
  COMMENT_LIST: new Url("/api/v1/comments/list/"),
  COMMENT_CREATE: new Url("/api/v1/comments/create/"),
  COMMENT_UPDATE: new Url("/api/v1/comments/:commentPk/update/"),
  COMMENT_DELETE: new Url("/api/v1/comments/:commentPk/delete/"),
  COMMENT_LIKE: new Url("/api/v1/comments/:commentPk/like/"),
  NEWS_LIST: new Url("/api/v1/news/"),
  NEWS_DETAIL: new Url("/api/v1/news/:newsPk/"),
  NEWS_LIKE: new Url("/api/v1/news/:newsPk/like/"),
  MEDIA_FOLDER: new Url("/api/v1/media/folder/"),
  MEDIA_FOLDER_DETAIL: new Url("/api/v1/media/folder/:mediaFolderPk/"),
  MEDIA_FOLDER_CREATE: new Url("/api/v1/media/folder/create/"),
  MEDIA_FOLDER_UPDATE: new Url("/api/v1/media/folder/:mediaFolderPk/update/"),
  MEDIA_FOLDER_DELETE: new Url("/api/v1/media/folder/:mediaFolderPk/delete/"),
  MEDIA: new Url("/api/v1/media/media/"),
  MEDIA_DETAIL: new Url("/api/v1/media/media/:mediaPk/"),
  MEDIA_CREATE: new Url("/api/v1/media/media/create/"),
  MEDIA_UPDATE: new Url("/api/v1/media/media/:mediaPk/update/"),
  MEDIA_DELETE: new Url("/api/v1/media/media/:mediaPk/delete/"),
  MEDIA_LIKE: new Url("/api/v1/media/media/:mediaPk/like/"),
  MEDIA_TO_MODERATE_MEDIA_SECTION: new Url(
    "/api/v1/media/media/:mediaPk/to-moderate-media/"
  ),
  MEDIA_TO_MODERATE_HOT_SECTION: new Url(
    "/api/v1/media/media/:mediaPk/to-moderate-hot/"
  ),
  CHAT_LIST: new Url("/api/v1/chats/list/"),
  CHAT_DETAIL: new Url("/api/v1/chats/:chatPk/detail/"),
  CHAT_CONVERSATION_CREATE: new Url("/api/v1/chats/conversation/create/"),
  CHAT_CREATE: new Url("/api/v1/chats/chat/create/"),
  CHAT_WITH_MODERATORS_CREATE: new Url(
    "/api/v1/chats/chat_with_moderators/create/"
  ),
  CHAT_WITH_DEVELOPERS_CREATE: new Url(
    "/api/v1/chats/chat_with_developers/create/"
  ),
  CHAT_WITH_MODERATORS_CHECK: new Url(
    "/api/v1/chats/chat_with_moderators/check/"
  ),
  CHAT_WITH_DEVELOPERS_CHECK: new Url(
    "/api/v1/chats/chat_with_developers/check/"
  ),
  CHAT_UPDATE: new Url("/api/v1/chats/:chatPk/update/"),
  CHAT_DELETE: new Url("/api/v1/chats/:chatPk/delete/"),
  CHAT_LEAVE: new Url("/api/v1/chats/:chatPk/leave/"),
  CHAT_BAN: new Url("/api/v1/chats/:chatPk/ban/user/"),
  CHAT_BLOCK: new Url("/api/v1/chats/:chatPk/block/user/"),
  CHAT_DETAIL_READ_ALL: new Url("/api/v1/chats/:chatPk/read-all/"),
  CHAT_READ_ALL: new Url("/api/v1/chats/read-all/"),
  MESSAGE_LIST: new Url("/api/v1/chats/message/list/"),
  MESSAGE_CREATE: new Url("/api/v1/chats/message/create/"),
  MESSAGE_UPDATE: new Url("/api/v1/chats/message/:messagePk/update/"),
  MESSAGE_DELETE: new Url("/api/v1/chats/message/:messagePk/delete/"),
  GROUP_LIST: new Url("/api/v1/groups/"),
  GROUP_DETAIL: new Url("/api/v1/groups/:groupSlug/detail/"),
  GROUP_CREATE: new Url("/api/v1/groups/create/"),
  GROUP_UPDATE: new Url("/api/v1/groups/:groupSlug/update/"),
  GROUP_DELETE: new Url("/api/v1/groups/:groupSlug/delete/"),
  GROUP_LEAVE: new Url("/api/v1/groups/:groupSlug/leave/"),
  CLUB_LIST: new Url("/api/v1/clubs/"),
  CLUB_DETAIL: new Url("/api/v1/clubs/:clubSlug/detail/"),
  CLUB_CREATE: new Url("/api/v1/clubs/create/"),
  CLUB_UPDATE: new Url("/api/v1/clubs/:clubSlug/update/"),
  CLUB_DELETE: new Url("/api/v1/clubs/:clubSlug/delete/"),
  CLUB_LEAVE: new Url("/api/v1/clubs/:clubSlug/leave/"),
  PARTY_LIST: new Url("/api/v1/events/"),
  PARTY_DETAIL: new Url("/api/v1/events/:partySlug/detail/"),
  PARTY_CREATE: new Url("/api/v1/events/create/"),
  PARTY_UPDATE: new Url("/api/v1/events/:partySlug/update/"),
  PARTY_DELETE: new Url("/api/v1/events/:partySlug/delete/"),
  PARTY_LIKE: new Url("/api/v1/events/:partySlug/like/"),
  PARTY_APPLY: new Url("/api/v1/events/:partySlug/apply/"),
  GAME_LIST: new Url("/api/v1/games/"),
  GAME_DETAIL: new Url("/api/v1/games/retrieve/:gameSlug/"),
  GAME_UPDATE: new Url("/api/v1/games/update/:gameSlug/"),
  GAME_DELETE: new Url("/api/v1/games/delete/:gameSlug/"),
  GAME_USER_DETAIL: new Url("/api/v1/games/user/retrieve/:gameUserPk/"),
  GAME_USER_CREATE: new Url("/api/v1/games/user/create/"),
  GAME_USER_UPDATE: new Url("/api/v1/games/user/update/:gameUserPk/"),
  GAME_USER_DELETE: new Url("/api/v1/games/user/delete/:gameUserPk/"),

  MODERATION_CHAT_WITH_MODERATORS_AND_DEVELOPERS_LIST: new Url(
    "/api/v1/moderation/chat_with_moderators_and_developers/"
  ),
  MODERATION_USERS: new Url("/api/v1/moderation/users/"),
  MODERATION_USER_TOGGLE_BAN: new Url(
    "/api/v1/moderation/users/:userPk/toggle/ban/"
  ),
  MODERATION_USER_SET_MEMBER: new Url(
    "/api/v1/moderation/users/:userPk/set/member/"
  ),
  MODERATION_USER_SET_REAL: new Url(
    "/api/v1/moderation/users/:userPk/set/real/"
  ),
  MODERATION_CLUBS: new Url("/api/v1/moderation/clubs/"),
  MODERATION_CLUB_TOGGLE_BAN: new Url(
    "/api/v1/moderation/clubs/:clubPk/toggle/ban/"
  ),
  MODERATION_CLUB_APPROVE: new Url("/api/v1/moderation/clubs/:clubPk/approve/"),
  MODERATION_CLUB_DECLINE: new Url("/api/v1/moderation/clubs/:clubPk/decline/"),
  MODERATION_PARTIES: new Url("/api/v1/moderation/parties/"),
  MODERATION_PARTY_TOGGLE_BAN: new Url(
    "/api/v1/moderation/parties/:partyPk/toggle/ban/"
  ),
  MODERATION_PARTY_APPROVE: new Url(
    "/api/v1/moderation/parties/:partyPk/approve/"
  ),
  MODERATION_PARTY_DECLINE: new Url(
    "/api/v1/moderation/parties/:partyPk/decline/"
  ),
  MODERATION_MEDIA: new Url("/api/v1/moderation/media/"),
  MODERATION_MEDIA_TOGGLE_BAN: new Url(
    "/api/v1/moderation/media/:mediaPk/toggle/ban/"
  ),
  MODERATION_MEDIA_APPROVE: new Url(
    "/api/v1/moderation/media/:mediaPk/approve/"
  ),
  MODERATION_MEDIA_DECLINE: new Url(
    "/api/v1/moderation/media/:mediaPk/decline/"
  ),
  MODERATION_POSTS: new Url("/api/v1/moderation/posts/"),
  MODERATION_POST_TOGGLE_BAN: new Url(
    "/api/v1/moderation/posts/:postPk/toggle/ban/"
  ),
  MODERATION_POST_APPROVE: new Url("/api/v1/moderation/posts/:postPk/approve/"),
  MODERATION_POST_DECLINE: new Url("/api/v1/moderation/posts/:postPk/decline/"),
  MODERATION_NEWS_LIST: new Url("/api/v1/moderation/news/"),
  MODERATION_NEWS_DETAIL: new Url("/api/v1/moderation/news/detail/:newsPk/"),
  MODERATION_NEWS_CREATE: new Url("/api/v1/moderation/news/create/"),
  MODERATION_NEWS_UPDATE: new Url("/api/v1/moderation/news/update/:newsPk/"),
  MODERATION_NEWS_DELETE: new Url("/api/v1/moderation/news/delete/:newsPk/"),

  SOCKJS: new Url("/sockjs/:userPk/"),
  COUNTERS: new Url("/api/v1/notifications/counters/"),
  MAP: new Url("/api/v1/events/map/"),
  CALENDAR: new Url("/api/v1/events/calendar/"),

  MOBILE_VERSION: new Url("/api/v1/mobile/version/")
};
