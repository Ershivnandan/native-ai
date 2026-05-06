// Mock llama.rn native module
jest.mock("llama.rn", () => ({
  initLlama: jest.fn(),
  releaseAllLlama: jest.fn(),
}));

// Mock react-native-mmkv
jest.mock("react-native-mmkv", () => ({
  createMMKV: () => ({
    set: jest.fn(),
    getString: jest.fn(),
    remove: jest.fn(),
    contains: jest.fn(() => false),
  }),
  MMKV: jest.fn(),
}));
