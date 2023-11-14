import { store } from "~/lib/utils";

export async function encrypt(data: string, key: CryptoKey): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);

  const iv = crypto.getRandomValues(new Uint8Array(12)); // Initialization Vector
  const encryptedData = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    dataBuffer
  );

  const encryptedBytes = new Uint8Array(encryptedData);
  const encryptedText = btoa(String.fromCharCode(...encryptedBytes));
  const ivText = btoa(String.fromCharCode(...iv));

  return `${ivText}:${encryptedText}`;
}

export async function decrypt(
  encryptedText: string,
  key: CryptoKey
): Promise<string> {
  const [ivText, encryptedDataText] = encryptedText.split(":");
  const iv = Uint8Array.from(atob(ivText), (c) => c.charCodeAt(0));
  const encryptedBytes = Uint8Array.from(atob(encryptedDataText), (c) =>
    c.charCodeAt(0)
  );

  const decryptedData = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    encryptedBytes
  );

  const decoder = new TextDecoder();
  return decoder.decode(decryptedData);
}

export async function getStoredKey() {
  const rawKey = await store.get<JsonWebKey>("encryptionKey");
  if (rawKey) {
    return crypto.subtle.importKey("jwk", rawKey, "AES-GCM", true, [
      "encrypt",
      "decrypt",
    ]);
  }
  const newKey = await generateKey();
  await store.set(
    "encryptionKey",
    await crypto.subtle.exportKey("jwk", newKey)
  );
  return newKey;
}

const generateKey = () =>
  crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, [
    "encrypt",
    "decrypt",
  ]);
