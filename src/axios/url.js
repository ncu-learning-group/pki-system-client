const prefix = "/api";

export const USER_LOGIN = prefix + "/user/login";
export const USER_REGISTER = prefix + "/user/regist";
export const GET_USER = prefix + "/user/getUser";
export const USER_LOGOUT = prefix + "/user/logout";

export const GET_PUBLIC_KEY = prefix + "/rsa/getPublicKey";
export const CHANGE_SECRET_KEY = prefix + "/rsa/changeSecretKey";
export const SEND = prefix + "boardMessage/save";
export const BOARD_PAGE = prefix + "/board/page";
export const BOARD_SAVE = prefix + "/board/save";
export const BOARD_DELETE = prefix + "/board/delete";
export const MESSAGE_PAGE = prefix + "/boardMessage/page";
export const MESSAGE_SAVE = prefix + "/boardMessage/save";
export const MESSAGE_SAVE_IMAGE = prefix + "/boardMessage/saveImage";
export const MESSAGE_DELETE = prefix + "/boardMessage/delete";

export const USER_PAGE = prefix + "/managerUser/page";
export const USER_SAVE = prefix + "/managerUser/save";
export const USER_DELETE = prefix + "/managerUser/delete";
