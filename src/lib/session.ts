export class SessionManager {
  private static SESSION_KEY = 'chat_session_id';
  
  static getSessionId(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.SESSION_KEY);
  }
  
  static setSessionId(sessionId: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.SESSION_KEY, sessionId);
  }
  
  static clearSession(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.SESSION_KEY);
  }
  
  static generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
