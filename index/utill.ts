export function getSecret() {
  const key = process.env.SECRET;
  if (!key) {
    throw new Error("No SECRET in .env");
  }
  return key;
}
