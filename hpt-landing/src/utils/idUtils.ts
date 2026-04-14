let _counter = 0;

export const generateNumericId = (): number => Date.now() * 1000 + (++_counter % 1000);
