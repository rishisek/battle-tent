interface Session {
  userID: number;
  username: string;
  connected: boolean;
}

abstract class SessionStore {
  protected sessions: Map<number, Session>;
  constructor() {
    this.sessions = new Map();
  }
  abstract findSession(id: number): Session | undefined;
  abstract saveSession(id: number, session: Session): void;
  abstract findAllSessions(): Session[];
}

export default class InMemorySessionStore extends SessionStore {
  findSession(id: number) {
    return this.sessions.get(id);
  }

  saveSession(id: number, session: Session) {
    this.sessions.set(id, session);
  }

  findAllSessions() {
    return [...this.sessions.values()];
  }
}
