export const getVisitorId = (): string => {
  let visitorId = localStorage.getItem('_vid');
  if (!visitorId) {
    visitorId = crypto.randomUUID();
    localStorage.setItem('_vid', visitorId);
  }
  return visitorId;
};

export const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('_sid');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem('_sid', sessionId);
  }
  return sessionId;
};

export const getSubscriberId = (): string | null => localStorage.getItem('_sub_id');

export const getVisitorContext = () => ({
  visitorId: getVisitorId(),
  sessionId: getSessionId(),
  subscriberId: getSubscriberId(),
});
