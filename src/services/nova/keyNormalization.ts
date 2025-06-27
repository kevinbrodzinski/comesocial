
/**
 * Key normalization utilities for consistent follow-up matching
 */

export const normalizeKey = (key: string): string => {
  return key
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');
};

export const normalizeUserReply = (reply: string): string => {
  return reply
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '');
};

export const findBestMatch = (userReply: string, branchKeys: string[]): string | null => {
  const normalizedReply = normalizeUserReply(userReply);
  
  // First try exact match
  const exactMatch = branchKeys.find(key => 
    normalizeKey(key) === normalizeKey(normalizedReply)
  );
  if (exactMatch) return exactMatch;
  
  // Then try partial match
  const partialMatch = branchKeys.find(key => {
    const normalizedKey = normalizeKey(key);
    return normalizedReply.includes(normalizedKey) || normalizedKey.includes(normalizedReply);
  });
  if (partialMatch) return partialMatch;
  
  // Finally try keyword matching
  const words = normalizedReply.split(/\s+/);
  const keywordMatch = branchKeys.find(key => {
    const keyWords = normalizeKey(key).split('-');
    return words.some(word => keyWords.includes(word));
  });
  
  return keywordMatch || null;
};
