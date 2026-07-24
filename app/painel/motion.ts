export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};
