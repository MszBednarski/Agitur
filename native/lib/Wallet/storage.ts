import AsyncStorage from '@react-native-async-storage/async-storage';

// not encrypted dont care it is a hackaton demo

const _WALLET_KEY = 'AGITUR_WALLET';

export async function storeSecret(value: string) {
  try {
    await AsyncStorage.setItem(_WALLET_KEY, value);
  } catch (e) {
    // saving error
  }
}
export async function getSecret(): Promise<string | null> {
  try {
    const value = await AsyncStorage.getItem(_WALLET_KEY);
    return value;
  } catch (e) {
    // error reading value
  }
  return null;
}
