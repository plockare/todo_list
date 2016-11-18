import messages from './messages';

export default class APIError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'APIError';
    this.status = status || 500;
  }
}

export { messages };
