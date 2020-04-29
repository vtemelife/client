export const scrollToBottom = () => {
  window.scrollTo({
    top:
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight,
    left: 0
  });
};

export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    left: 0
  });
};
