export class Validation {
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidUsername(username: string): boolean {
    return username.length >= 3 && username.length <= 32 && /^[a-zA-Z0-9_-]+$/.test(username);
  }

  static isValidPassword(password: string): boolean {
    return password.length >= 8;
  }

  static isValidDomain(domain: string): boolean {
    const domainRegex = /^([a-zA-Z0-9*-]+\.)*[a-zA-Z0-9*-]+\.[a-zA-Z]{2,}$/;
    return domainRegex.test(domain);
  }

  static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}