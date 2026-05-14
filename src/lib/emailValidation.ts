// Blocked domains - reserved, test, and disposable email providers
const BLOCKED_DOMAINS = [
  // RFC 2606 reserved domains
  'example.com', 'example.org', 'example.net',
  // Common test domains
  'test.com', 'test.org', 'test.net',
  // Disposable email providers
  'mailinator.com', 'guerrillamail.com', 'guerrillamail.org',
  'tempmail.com', 'throwaway.com', 'temp-mail.org',
  'fakeinbox.com', 'sharklasers.com', 'grr.la',
  'guerrillamail.info', 'pokemail.net', 'spam4.me',
  'trashmail.com', 'yopmail.com', '10minutemail.com',
  'getnada.com', 'mohmal.com', 'tempail.com',
  'dispostable.com', 'mailnesia.com', 'maildrop.cc',
  // Obviously fake
  'fake.com', 'invalid.com', 'nowhere.com',
];

// Patterns to block in local part (before @)
const BLOCKED_LOCAL_PATTERNS = [
  /^test[0-9]*$/i,           // test, test1, test123
  /^tester[0-9]*$/i,         // tester, tester1
  /^testing[0-9]*$/i,        // testing, testing1
  /^admin[0-9]*$/i,          // admin, admin1
  /^user[0-9]*$/i,           // user, user1
  /^demo[0-9]*$/i,           // demo, demo1
  /^fake[0-9]*$/i,           // fake, fake1
  /^sample[0-9]*$/i,         // sample, sample1
  /^example[0-9]*$/i,        // example, example1
  /^asdf+[0-9]*$/i,          // asdf, asdfasdf
  /^qwerty[0-9]*$/i,         // qwerty, qwerty123
  /^aaa+[0-9]*$/i,           // aaa, aaaa
  /^bbb+[0-9]*$/i,           // bbb, bbbb
  /^xxx+[0-9]*$/i,           // xxx, xxxx
  /^zzz+[0-9]*$/i,           // zzz, zzzz
  /^abc[0-9]*$/i,            // abc, abc123
  /^123[0-9]*$/i,            // 123, 12345
  /^null$/i,                 // null
  /^undefined$/i,            // undefined
  /^none$/i,                 // none
  /^noemail$/i,              // noemail
  /^no-?reply$/i,            // noreply, no-reply
];

interface ValidationResult {
  valid: boolean;
  reason?: string;
}

export function validateEmail(email: string): ValidationResult {
  const trimmedEmail = email.trim().toLowerCase();
  
  // Basic format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    return { valid: false, reason: "Please enter a valid email address." };
  }

  const [localPart, domain] = trimmedEmail.split('@');
  
  // Check for blocked domains
  if (BLOCKED_DOMAINS.includes(domain)) {
    return { 
      valid: false, 
      reason: "This email domain is not accepted. Please use your real email." 
    };
  }

  // Check for blocked local part patterns
  for (const pattern of BLOCKED_LOCAL_PATTERNS) {
    if (pattern.test(localPart)) {
      return { 
        valid: false, 
        reason: "This appears to be a test email. Please use your actual email address." 
      };
    }
  }

  // Check TLD length (must be at least 2 chars)
  const tld = domain.split('.').pop();
  if (!tld || tld.length < 2) {
    return { valid: false, reason: "Please enter a valid email address." };
  }

  // Check for keyboard spam patterns (consecutive same chars)
  if (/(.)\1{4,}/.test(localPart)) {
    return { 
      valid: false, 
      reason: "Please enter a valid email address." 
    };
  }

  // Check minimum local part length
  if (localPart.length < 2) {
    return { valid: false, reason: "Please enter a valid email address." };
  }

  return { valid: true };
}
