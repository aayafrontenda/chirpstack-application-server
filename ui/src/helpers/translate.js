import { formatMessage } from "devextreme/localization";

export const translate = (file, key) => {
  return formatMessage(`${file}.${key}`);
};
