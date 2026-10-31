export const markRef = (node: HTMLElement | null) => {
  if (node) node.dataset.refReady = "true";
};
