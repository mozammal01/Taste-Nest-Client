export function extractMessageFromString(str: string): string {
  try {
    const parsed = JSON.parse(str);
    if (parsed && typeof parsed === 'object') {
      if ('message' in parsed && typeof parsed.message === 'string') {
        return extractMessageFromString(parsed.message);
      }
      if ('message' in parsed && typeof parsed.message === 'object' && parsed.message !== null) {
        return extractMessageFromString(JSON.stringify(parsed.message));
      }
    }
  } catch {}
  return str;
}

export function getErrorMessage(error: unknown): string {
  // Log the raw error for debugging purposes
  console.log('🔎 Caught error:', error);

  // If the error itself is a string, check if it's JSON and extract from it
  if (typeof error === 'string') {
    return extractMessageFromString(error);
  }

  // Axios‑style error (error.response?.data?.message)
  if (typeof error === 'object' && error !== null && 'response' in (error as Record<string, unknown>)) {
    const resp = (error as Record<string, unknown>).response;
    if (resp && typeof resp === 'object' && 'data' in (resp as Record<string, unknown>)) {
      const data = (resp as Record<string, unknown>).data;
      if (data && typeof data === 'object' && 'message' in (data as Record<string, unknown>)) {
        const msg = (data as Record<string, unknown>).message;
        if (typeof msg === 'string') {
          return extractMessageFromString(msg);
        }
        return extractMessageFromString(JSON.stringify(msg));
      }
    }
  }

  // Fetch‑style error where the thrown value is already the parsed JSON body
  if (typeof error === 'object' && error !== null && 'message' in (error as Record<string, unknown>)) {
    const msg = (error as Record<string, unknown>).message;
    if (typeof msg === 'string') {
      return extractMessageFromString(msg);
    }
    return extractMessageFromString(JSON.stringify(msg));
  }

  // Generic fallback
  try {
    return extractMessageFromString(JSON.stringify(error));
  } catch {
    return 'Something went wrong';
  }
}