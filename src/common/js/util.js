// 节流函数
export function debounce(func, delay) {
  let timer;
  return function (...args) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      // args分别包含新值和旧值
      func.apply(this, args);
    }, delay);
  };
};
